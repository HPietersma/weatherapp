import { View, Text, Alert, SafeAreaView, StyleSheet, ActivityIndicator, ScrollView, RefreshControl, Image, TextInput, FlatList, Dimensions } from 'react-native';
import React, { useEffect, useState} from 'react';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import Ionic from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ScreenOrientation from 'expo-screen-orientation';
import Orientation from 'react-native-orientation';




const api = `https://api.openweathermap.org/data/2.5/forecast?lat=52.5089759&lon=6.0943765&appid=e69945c2d5adf32b3ec7cfd57647ef87`;

const Weather = () => {
    const [forecast, setForecast] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [cityName, setCityName] = useState('');
    const [tempSetting, setTempSetting] = useState(true);
    const [windspeedSetting, setWindspeedSetting] = useState('Km/h');
    const [orientation, setOrientation] = useState('portrait');

    const loadForecast = async () => {
        setRefreshing(true);

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status != 'granted') {
            setRefreshing(false);
            Alert('Geen rechten voor het behalen van uw locatie');
        }

        let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});

        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=e69945c2d5adf32b3ec7cfd57647ef87`);
        const data = await response.json();

        if (!response.ok) {
            Alert.alert('Services zijn momenteel niet beschikbaar');
        }
        else {
            setForecast(data);
        }
        setRefreshing(false);
    }

    const loadForecastByCity = async () => {
        setRefreshing(true);

        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=e69945c2d5adf32b3ec7cfd57647ef87`);
        const data = await response.json();


        if (!response.ok) {
            Alert.alert('City not found');
        }
        else {
            setForecast(data);
        }
        setRefreshing(false);

    }
    
    const getTempSetting = async () => {
        try {
            const value = await AsyncStorage.getItem('@tempSetting');
            if (value != null) {
                setTempSetting(value);
            }
        }
        catch (err) {
        }
    }

    const getWindspeedSetting = async () => {
        try {
            const value = await AsyncStorage.getItem('@windspeedSetting');
            if (value != null) {
                setWindspeedSetting(value);
            }
        }
        catch (err) {
        }
    }

    const loadForecastDefaultLocation = async (location) => {
        setRefreshing(true);

        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=e69945c2d5adf32b3ec7cfd57647ef87`);
        const data = await response.json();


        if (!response.ok) {
            Alert.alert('City not found');
        }
        else {
            setForecast(data);
        }
        setRefreshing(false);
    }

    const checkIfLocationIsSet = async () => {
        try {
            const value = await AsyncStorage.getItem('@defaultLocationSetting');

            if (value != null) {
                loadForecastDefaultLocation(value);
            }
            else {
                loadForecast();
            }
        }
        catch (err) {
        }
    }

    Dimensions.addEventListener('change', () => {
        const dim = Dimensions.get('screen');

        if (dim.height >= dim.width) {
            setOrientation('portrait');
        }
        else {
            setOrientation('landscape');
        }
    })


    useEffect(() => {
        checkIfLocationIsSet();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getTempSetting();
            getWindspeedSetting();
        }, [])
    );

  
    if (!forecast) {
        return (
            <SafeAreaView style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size='large' />
                <Text>
                    Loading
                </Text>
            </SafeAreaView>
        );
    }

    if (orientation == 'portrait') {
        return (
            <SafeAreaView style={styles.container}> 
                <ScrollView 
                    refreshControl={
                        <RefreshControl 
                            refreshing={refreshing} 
                            onRefresh={() => loadForecast()}
                        />
                    }
                    style={{marginTop:50}}
                >
                    <View
                        style={{marginHorizontal: 10}}
                    >
                        <TextInput
                            style={styles.input}
                            placeholder="Location.."
                            value={cityName}
                            onChangeText={(text) => setCityName(text)}
                            onSubmitEditing={loadForecastByCity}
                        >
                            
                        </TextInput>
                    </View>
                
                    <Text style={styles.title}>
                        {forecast.city.name}
                    </Text>

                    { tempSetting == 'true' && 
                        <Text style={styles.temp}>
                            {Math.round(forecast.list[0].main.temp - 273.15)}ºC
                        </Text>
                    }
                    { tempSetting == 'false' && 
                        <Text style={styles.temp}>
                            {Math.round(forecast.list[0].main.temp * 9 / 5 - 459.67)}ºF
                        </Text>
                    }

                    <View
                        style={{alignItems: 'center', marginTop: -40}}
                    >
                        <Image
                            style={styles.icon}
                            source={{
                                uri: `http://openweathermap.org/img/wn/${forecast.list[0].weather[0].icon}@4x.png`
                            }}
                        
                        />
                    </View>

                    <Text style={styles.currentDescription}>
                        {forecast.list[0].weather[0].description}
                    </Text>


                    <View
                        style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 20}}
                    >
                        <View
                            style={styles.infoBox}
                        >
                            <FontAwesome
                                color='white'
                                size={30}
                                name='location-arrow'
                                style={{transform: [{rotate: `${forecast.list[0].wind.deg - 45}deg`}], marginBottom: 10}}
                            />

                            { windspeedSetting == 'Km/h' && 
                                <Text style={{textAlign: 'center', color: 'white', fontSize: 20, fontWeight: 'bold'}}>
                                    {Math.round(forecast.list[0].wind.speed * 3.6)} Km/h
                                </Text>
                            }
                            { windspeedSetting == 'Knots' && 
                                <Text style={{textAlign: 'center', color: 'white', fontSize: 20, fontWeight: 'bold'}}>
                                    {Math.round(forecast.list[0].wind.speed * 1.94)} Knots
                                </Text>
                            }
                            { windspeedSetting == 'Beaufort' && 
                                <Text style={{textAlign: 'center', color: 'white', fontSize: 20, fontWeight: 'bold'}}>
                                    {Math.round(forecast.list[0].wind.speed * 1.127)} Bft
                                </Text>
                            }

                        </View>

                        <View
                            style={styles.infoBox}
                        >
                            <Ionic
                                name='water'
                                color='white'
                                size={40}
                            >
                    
                            </Ionic>
                            <Text
                                style={{textAlign: 'center',color: 'white', fontSize: 20, fontWeight: 'bold' }}
                            >
                                {forecast.list[0].main.humidity}%
                            </Text>
                        </View>

                        <View
                            style={styles.infoBox}
                        >
                            <FontAwesome
                                color='white'
                                size={30}
                                name='weight-hanging'
                                style={{marginBottom: 5}}
                            >

                            </FontAwesome>
                            <Text
                                style={{textAlign: 'center', color: 'white', fontSize: 20, fontWeight: 'bold'}}
                            >
                                {forecast.list[0].main.pressure / 1000} Bar
                            </Text>
                        </View>
                        
                    </View>

                    <FlatList
                        horizontal
                        data={forecast.list.slice(0,12)}
                        keyExtractor={(item, index) => index.toString()}
                        style={{marginTop: 50}}
                        renderItem={({item}) => {
                            let dt = new Date(item.dt * 1000);
                            return (
                                <View style={styles.hourlyForcast}>
                                    <Text style={{color: 'white'}}>
                                        {dt.toLocaleTimeString().substring(0,5)}
                                    </Text>
                                    { tempSetting == 'true' && 
                                        <Text style={{color: 'white'}}>
                                            {Math.round(item.main.temp - 273.15)}ºC
                                        </Text>
                                    }
                                    { tempSetting == 'false' && 
                                        <Text style={{color: 'white'}}>
                                            {Math.round(item.main.temp * 9 / 5 - 459.67)}ºF
                                        </Text>
                                    }
                                    <Image
                                        style={styles.forecastIcon}
                                        source={{
                                            uri: `http://openweathermap.org/img/wn/${forecast.list[0].weather[0].icon}@2x.png`
                                        }}
                                    />
                                </View>
                            )
                        }}
                    />
                </ScrollView>
            </SafeAreaView>
        )
    }

    if (orientation == 'landscape') {
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    horizontal
                    data={forecast.list}
                    keyExtractor={(item, index) => index.toString()}
                    style={{marginTop: 30}}
                    renderItem={({item}) => {
                        let dt = new Date(item.dt * 1000);
                        let dayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        let monthArray = ['Januari', 'Februari', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Oktober', 'November', 'December'];

                        if (dt.toLocaleTimeString() == '13:00:00') {
                            return (
                                <View style={styles.weekForecast}>
                                    <View style={{width: '100%', alignItems: 'center', backgroundColor: '#46548a'}}>
                                        <Text style={{color: 'white', fontWeight: 'bold'}}>
                                            {dayArray[dt.getDay()]} {dt.getDate()} {monthArray[dt.getMonth()]}
                                        </Text>

                                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: -10}}>
                                            <Image
                                                style={{height: 100, width: 75, }}
                                                source={{
                                                    uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
                                                }}
                                            />
                                            { tempSetting == 'true' && 
                                                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 25}}>
                                                    {Math.round(item.main.temp - 273.15)}ºC
                                                </Text>
                                            }
                                            { tempSetting == 'false' && 
                                                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 25}}>
                                                    {Math.round(item.main.temp * 9 / 5 - 459.67)}ºF
                                                </Text>
                                            }
                                        </View>
                                    
                                        <Text style={{color: 'white', marginTop: -10, marginBottom: 15,fontWeight: 'bold'}}>
                                            {item.weather[0].description}
                                        </Text>
                                    </View>

                                    <View style={{width: '100%', backgroundColor: '#5674a3', alignItems: 'center', paddingVertical: 10}}>
                                        <FontAwesome
                                            color='white'
                                            size={30}
                                            name='location-arrow'
                                            style={{transform: [{rotate: `${item.wind.deg - 45}deg`}], marginBottom: 10}}
                                        />
                                        { windspeedSetting == 'Km/h' && 
                                            <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>
                                                {Math.round(item.wind.speed * 3.6)} Km/h
                                            </Text>
                                        }
                                        { windspeedSetting == 'Knots' && 
                                            <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>
                                                {Math.round(item.wind.speed * 1.94)} Knots
                                            </Text>
                                        }
                                        { windspeedSetting == 'Beaufort' && 
                                            <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>
                                                {Math.round(item.wind.speed * 1.127)} Bft
                                            </Text>
                                        }
                                    </View>

                                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',width: '100%', backgroundColor: '#6e8ab8'}}>
                                        <Ionic
                                            name='water'
                                            color='white'
                                            size={40}
                                        >
                                
                                        </Ionic>
                                        <Text
                                            style={{textAlign: 'center',color: 'white', fontWeight: 'bold' }}
                                        >
                                            {item.main.humidity}%
                                        </Text>
                                    </View>

                                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 5, width: '100%', backgroundColor: '#8a9fbf'}}>
                                        <FontAwesome
                                            color='white'
                                            size={25}
                                            name='weight-hanging'
                                            style={{marginRight: 5}}
                                        >

                                        </FontAwesome>
                                        <Text
                                            style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}
                                        >
                                            {item.main.pressure / 1000} Bar
                                        </Text>
                                    </View>
                                </View>
                            )
                        }
                    }}
                />
            </SafeAreaView>
        )
    }
}

export default Weather

// 88, 105, 173
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5869ad',
    },

    title: {
        textAlign: 'center',
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white'
    },

    icon: {
        width: 300,
        height: 250,
    },

    temp: {
        fontSize: 50,
        fontWeight: 'bold',
        marginLeft: 40,
        color: 'white'
    },

    input: {
        backgroundColor: 'white',
        height: 40,
        padding: 10,
        borderWidth: 1
    },

    currentDescription: {
        textAlign: 'center',
        fontSize: 30,
        marginTop: -20,
        color: 'white'
    },

    hourlyForcast: {
        padding: 6,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#46548a'
    },

    weekForecast: {
        paddingVertical: 6,
        alignItems: 'center',
        marginHorizontal: 5,
        width: 200,
        borderRadius: 5
    },

    forecastIcon: {
        width: 75,
        height: 62.5
    },

    infoBox: {
        backgroundColor: '#46548a', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: 110,
        width: 110,
        borderRadius: 5
    }
})
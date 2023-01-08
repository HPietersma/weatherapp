import { View, Text, Alert, SafeAreaView, StyleSheet, ActivityIndicator, ScrollView, RefreshControl, Image, TextInput, FlatList } from 'react-native';
import React, { useEffect, useState} from 'react';
import * as Location from 'expo-location';

const api = `https://api.openweathermap.org/data/2.5/forecast?lat=52.5089759&lon=6.0943765&appid=e69945c2d5adf32b3ec7cfd57647ef87`;

const Weather = () => {
    const [forecast, setForecast] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

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

    useEffect(() => {
        loadForecast();
    }, []);

    if (!forecast) {
        return (
            <SafeAreaView style={styles.loading}>
                <ActivityIndicator size='large' />
                <Text>
                    Loading
                </Text>
            </SafeAreaView>
        );
    }

    //const current = forecast.currrent.weather[0];

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
                    >
                        
                    </TextInput>
                </View>
             
                <Text style={styles.title}>
                    {forecast.city.name}
                </Text>

                <Text style={styles.temp}>
                    {Math.round(forecast.list[0].main.temp - 273)}ºC
                </Text>

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

                <FlatList
                    horizontal
                    data={forecast.list.slice(0,24)}
                    keyExtractor={(item, index) => index.toString()}
                    style={{marginTop: 50}}
                    renderItem={({item}) => {
                        // const weather = hour.weather[0];
                        let dt = new Date(item.dt * 1000);
                        return (
                            <View style={styles.hourlyForcast}>
                                <Text>
                                    {dt.toLocaleTimeString().substring(0,5)}
                                </Text>
                                <Text>
                                    {Math.round(item.main.temp - 273)}ºC
                                </Text>
                                <Image
                                    style={styles.forecastIcon}
                                    source={{
                                        uri: `http://openweathermap.org/img/wn/${forecast.list[0].weather[0].icon}@2x.png`
                                    }}
                                >

                                </Image>
                            </View>
                        )
                    }}
                />

            </ScrollView>
        </SafeAreaView>
    )


}

export default Weather


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#84c4f4',
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
        fontSize: 40,
        fontWeight: 'bold',
        marginLeft: 40,
        marginTop: 50,
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
        borderColor: 'white'
    },

    forecastIcon: {
        width: 75,
        height: 62.5
    }
})
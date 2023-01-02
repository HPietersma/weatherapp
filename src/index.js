import { View, Text, Alert, SafeAreaView, StyleSheet, ActivityIndicator, ScrollView, RefreshControl, Image, TextInput } from 'react-native';
import React, { useEffect, useState} from 'react';
import * as Location from 'expo-location';

const api = `https://api.openweathermap.org/data/2.5/forecast?lat=52.5089759&lon=6.0943765&appid=e69945c2d5adf32b3ec7cfd57647ef87`

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
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Locatie"
                    >
                        
                    </TextInput>
                </View>
             
                <Text style={styles.title}>
                    {forecast.city.name}
                </Text>
                <Text style={{allignItems: 'center', textAlign:'center'}}>
                    Your location
                </Text>
                <Text style={styles.temp}>
                    {Math.round(forecast.list[0].main.temp - 271)}ºC
                </Text>
                <View>
                    <Image
                        style={styles.largeIcon}
                        source={{
                            uri: `http://openweathermap.org/img/wn/${forecast.list[0].weather[0].icon}@4x.png`
                        }}
                    
                    />

                </View>
            </ScrollView>
        </SafeAreaView>
    )


}

export default Weather

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    title: {
        textAlign: 'center',
        fontSize: 36,
        fontWeight: 'bold',
        color: 'black'
    },

    largeIcon: {
        width: 300,
        height: 250,

    },

    temp: {
        fontSize: 40,
        fontWeight: 'bold'
    },

    input: {
        backgroundColor: 'white',
        height: 40,
        padding: 10,
        borderWidth: 1
    }
})
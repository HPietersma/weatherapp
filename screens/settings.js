import { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Switch, TextInput} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";


export default function Settings() {

    const [tempSetting, setTempSetting] = useState(true);
    const [windspeedSetting, setWindspeedSetting] = useState('Km/h');
    const [defaultLocationSetting, setDefaultLocationSetting] = useState(null);

    function toggeSwitch() {
        setTempSetting(previousstate => !previousstate);
        storeTempSetting();
    }

    function setWindspeedSettingData(value) {
        setWindspeedSetting(value);
        storeWindspeedSetting(value);
    }

    const storeTempSetting = async () =>  {
        try {
            await AsyncStorage.setItem('@tempSetting', tempSetting.toString()
            )
        }
        catch (err) {

        }
    }

    const storeWindspeedSetting = async (value) =>  {
        try {
            await AsyncStorage.setItem('@windspeedSetting', value
            )
        }
        catch (err) {

        }
    }

    const storeDefaultLocationSetting = async () =>  {
        try {
            await AsyncStorage.setItem('@defaultLocationSetting', defaultLocationSetting.toString()
            )
        }
        catch (err) {

        }
    }

    useEffect(() => {
        loadStoredData();
    }, []);

    const loadStoredData = async () => {
        try {
            const windspeed = await AsyncStorage.getItem('@windspeedSetting');
            const temp = await AsyncStorage.getItem('@tempSetting');
            const defaultLocation = await AsyncStorage.getItem('@defaultLocationSetting');

            if (windspeed != null) {
                setWindspeedSetting(windspeed);
            }

            if (temp != null) {
                if (temp == 'true') {
                    setTempSetting(false);
                }
                else {
                    setTempSetting(true);
                }
            }

            if (defaultLocation != null) {
                setDefaultLocationSetting(defaultLocation);
            }
        }
        catch (err) {
        }
    }
 

    return (
        <SafeAreaView style={{paddingTop: 50, paddingHorizontal: 20, backgroundColor: '#5869ad', height: '100%'}}>
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                    Temperature
                </Text>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>ºC</Text>
                    <Switch
                        value={tempSetting}
                        onValueChange={toggeSwitch}  
                        trackColor={{false: 'gray', true: 'gray'}}
                        thumbColor={tempSetting ? 'white' : 'white'}
                    >
                    </Switch>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>ºF</Text>
                </View>
            </View>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                    Windspeed
                </Text>
                <Picker
                    selectedValue={windspeedSetting}
                    onValueChange={(value) => setWindspeedSettingData(value)}
                    style={{width: 140, color: 'white'}}
                >
                    <Picker.Item label= 'Km/h' value= 'Km/h' />
                    <Picker.Item label= 'Knots' value= 'Knots' />
                    <Picker.Item label= 'Beaufort' value= 'Beaufort' />
                </Picker>
            </View>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10}}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                    Default location
                </Text>
                <TextInput
                    style={{height: 40, padding: 10, borderWidth: 1, backgroundColor: 'white', width: 150}}
                    placeholder="Location.."
                    value={defaultLocationSetting}
                    onChangeText={(text) => setDefaultLocationSetting(text)}
                    onSubmitEditing={storeDefaultLocationSetting}
                />
            </View>
        </SafeAreaView>
    );
}
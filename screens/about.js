import { View, Text, SafeAreaView } from "react-native";

export default function Settings() {
    return (
      <SafeAreaView style={{paddingTop: 50, alignItems: 'center', backgroundColor: '#5869ad', height: '100%'}}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>
            Gemaakt door Hessel Pietersma
        </Text>
        <Text style={{color: 'white', fontWeight: 'bold'}}>
            15-1-2023
        </Text>
        <Text style={{color: 'white', fontWeight: 'bold'}}>
         ©Hessel
        </Text>
      </SafeAreaView>
    );
}
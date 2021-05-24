import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { AntDesign } from '@expo/vector-icons';

export default function App(props) {
    console.log(props);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        console.log("d------",data)
        props.closeModal();
        props.fetchCityDetails(data)
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={{flex:1}}>
            <View style={{padding: 16, backgroundColor:'#000', flexDirection:'row', alignItems:'center'}}>
                <TouchableOpacity onPress={props.closeModal}>
                    <AntDesign name="arrowleft" size={24} color="#fff"/>
                </TouchableOpacity>
                <Text style={{color:'#fff',marginLeft:16, fontSize:20}}>Scan</Text>
            </View>
            <View style={{flex:1, backgroundColor:'#000', padding:0}}>
                <BarCodeScanner
                    onBarCodeScanned={handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
            </View>

        </View>
    );
}

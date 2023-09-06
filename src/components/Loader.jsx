import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

const Loader = (props) => {
    return (
        <View className="flex-1 flex justify-center items-center">
            <ActivityIndicator {...props} />
        </View>
    );
}

const styles = StyleSheet.create({})

export default Loader;

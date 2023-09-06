import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';


const WelcomeScreen = () => {

    const ring1padding = useSharedValue(0);
    const ring2padding = useSharedValue(0);

    const navigation = useNavigation();

    useEffect(() => {
        ring1padding.value = 0;
        ring2padding.value = 0;
        setTimeout(() => ring1padding.value = withSpring(ring1padding.value + hp(5)), 100);
        setTimeout(() => ring2padding.value = withSpring(ring2padding.value + hp(5.5)), 300);

        setTimeout(() => navigation.navigate('Home'), 2500)
    }, [])


    return (
        <View className="items-center justify-center flex-1 space-y-10 bg-amber-500">
            <StatusBar style="light" />

            <Animated.View className="rounded-full bg-white/20" style={{ padding: ring2padding }}>
                <Animated.View className="rounded-full bg-white/20" style={{ padding: ring1padding }}>
                    <Image source={require('../../assets/images/welcome.png')}
                        style={{ width: hp(20), height: hp(20) }} />
                </Animated.View>
            </Animated.View>

            <View className="flex items-center max-w-xs space-y-2">
                <Text style={{ fontSize: hp(7) }} className="font-bold tracking-widest text-white">
                    Gusto
                </Text>
                <Text style={{ fontSize: hp(2.4) }} className="font-medium tracking-widest text-center text-white">
                    Recipes for every taste and occasion.
                </Text>
            </View>
        </View>
    );
}

export default WelcomeScreen;

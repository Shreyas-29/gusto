import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon, ClockIcon, FireIcon } from 'react-native-heroicons/outline';
import { HeartIcon, UsersIcon } from 'react-native-heroicons/solid';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import YouTubeIframe from 'react-native-youtube-iframe';
import Loader from '../components/Loader';

const RecipeDetails = (props) => {

    const item = props.route.params;

    const navigation = useNavigation();

    const [liked, setLiked] = useState(false);
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const nameLength = item.strMeal.length;
    const imageLength = item.strMealThumb.length;
    const minutes = nameLength * 2;
    const servings = nameLength + imageLength;
    const calories = nameLength * 5;

    useEffect(() => {
        getRecipes(item.idMeal);
        const fetchLiked = async () => {
            try {
                const likedValue = await AsyncStorage.getItem('liked');
                setLiked(likedValue === 'true');
            } catch (error) {
                console.error('Error fetching liked data:', error);
            }
        };
        fetchLiked();
    }, []);

    const getRecipes = async (id) => {
        try {

            const response = await axios.get(`https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            // console.log('got recipes: ', response.data);
            if (response && response.data) {
                setMeal(response.data.meals[0]);
                setLoading(false);
            }

        } catch (err) {
            console.log('error: ', err.message);
        }
    };

    const ingredientsIndexs = () => {
        if (!meal) return [];
        let indexs = [];
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                indexs.push(i);
            }
        };

        return indexs;
    };

    const getYoutubeVideoId = (url) => {
        const regex = /[?&]v=([^&]+)/;
        const match = url.match(regex);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await getRecipes(item.idMeal);
        setRefreshing(false);
    }, [item.idMeal]);

    const handleLiked = async () => {
        setLiked(!liked);
        try {
            if (!liked) {
                await AsyncStorage.setItem('liked', 'true');
            } else {
                await AsyncStorage.removeItem('liked');
            }
        } catch (error) {
            console.error('Error storing data:', error);
        }
    };


    return (
        <ScrollView
            className="flex-1 bg-white"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} style={{ marginTop: hp(10) }} />}
        >
            <StatusBar />

            <View className="flex-row justify-center">
                <Animated.Image
                    source={{ uri: item?.strMealThumb }}
                    style={{ width: wp(98), height: hp(50), borderRadius: 35, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginTop: 4 }}
                    className="bg-black/5"
                    sharedTransitionTag={item.strMeal}
                />
            </View>

            <Animated.View
                entering={FadeIn.delay(200).duration(1000)}
                className="absolute flex-row items-center justify-between w-full pt-14">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 ml-5 bg-white rounded-full">
                    <ChevronLeftIcon size={hp(3.5)} strokeWidth={2.5} color="#fbbf24" className="to-amber-400" />
                </TouchableOpacity>
                <TouchableOpacity className="p-2 mr-5 bg-white rounded-full" onPress={handleLiked}>
                    <HeartIcon size={hp(3.5)} strokeWidth={2.5} color={liked ? "#ef4444" : "#6b7280"} className="to-red-500" />
                </TouchableOpacity>
            </Animated.View>

            {loading ? (
                <Loader size="large" className="mt-16" color="#fcd34d" />
            ) : (
                <View className="flex justify-between px-4 pt-8 space-y-4">
                    <Animated.View
                        entering={FadeInDown.duration(700).springify().damping(12)}
                        className="space-y-2"
                    >
                        <Text style={{ fontSize: hp(3) }} className="flex-1 font-bold text-neutral-800">
                            {meal?.strMeal}
                        </Text>
                        <Text style={{ fontSize: hp(2) }} className="flex-1 font-medium text-neutral-500">
                            {meal?.strArea}
                        </Text>
                    </Animated.View>
                    <Animated.View
                        entering={FadeInDown.delay(100).duration(700).springify().damping(12)}
                        className="flex-row justify-around"
                    >
                        <View className="flex p-2 rounded-full bg-amber-300">
                            <View
                                style={{ height: hp(6.5), width: hp(6.5) }}
                                className="flex-row items-center justify-center bg-white rounded-full to-gray-400"
                            >
                                <ClockIcon size={hp(3.5)} strokeWidth={2} color="#9ca3af" />
                            </View>
                            <View className="flex items-center py-2 space-y-1">
                                <Text style={{ fontSize: hp(2) }} className="font-bold text-neutral-700">
                                    {minutes}
                                </Text>
                                <Text style={{ fontSize: hp(1.3) }} className="font-bold text-neutral-700">
                                    Mins
                                </Text>
                            </View>
                        </View>
                        <View className="flex p-2 rounded-full bg-amber-300">
                            <View
                                style={{ height: hp(6.5), width: hp(6.5) }}
                                className="flex-row items-center justify-center bg-white rounded-full to-gray-400"
                            >
                                <UsersIcon size={hp(3.5)} strokeWidth={2} color="#9ca3af" />
                            </View>
                            <View className="flex items-center py-2 space-y-1">
                                <Text style={{ fontSize: hp(2) }} className="font-bold text-neutral-700">
                                    {servings}
                                </Text>
                                <Text style={{ fontSize: hp(1.3) }} className="font-bold text-neutral-700">
                                    Servings
                                </Text>
                            </View>
                        </View>
                        <View className="flex p-2 rounded-full bg-amber-300">
                            <View
                                style={{ height: hp(6.5), width: hp(6.5) }}
                                className="flex-row items-center justify-center bg-white rounded-full to-gray-400"
                            >
                                <FireIcon size={hp(3.5)} strokeWidth={2} color="#9ca3af" />
                            </View>
                            <View className="flex items-center py-2 space-y-1">
                                <Text style={{ fontSize: hp(2) }} className="font-bold text-neutral-700">
                                    {calories}
                                </Text>
                                <Text style={{ fontSize: hp(1.3) }} className="font-bold text-neutral-700">
                                    Cals
                                </Text>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Ingredients */}
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(700).springify().damping(12)}
                        className="space-y-4"
                    >
                        <Text style={{ fontSize: hp(2) }} className="flex-1 font-bold text-neutral-700">
                            Ingredients
                        </Text>
                        <View className="ml-3 space-y-2">
                            {ingredientsIndexs(meal)?.map((index) => {
                                return (
                                    <View key={index} className="flex-row items-center space-x-4">
                                        <View
                                            style={{ height: hp(1.5), width: hp(1.5) }}
                                            className="rounded-full bg-amber-300"
                                        />
                                        <View className="flex-row skew-x-2">
                                            <Text style={{ fontSize: hp(1.8) }} className="font-extrabold text-neutral-700">
                                                {meal[`strMeasure${index}`]}
                                            </Text>
                                            <Text style={{ fontSize: hp(1.8) }} className="ml-1 font-medium text-neutral-600">
                                                {meal[`strIngredient${index}`]}
                                            </Text>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    </Animated.View>

                    {/* Instructions */}
                    <Animated.View
                        entering={FadeInDown.delay(300).duration(700).springify().damping(12)}
                        className="space-y-4"
                    >
                        <Text style={{ fontSize: hp(2) }} className="flex-1 font-bold text-neutral-700">
                            Instructions
                        </Text>
                        <Text style={{ fontSize: hp(1.6) }} className="text-neutral-700">
                            {meal?.strInstructions}
                        </Text>
                    </Animated.View>

                    {/* Video */}
                    {meal.strYoutube && (
                        <Animated.View
                            entering={FadeInDown.delay(400).duration(700).springify().damping(12)} className="space-y-4">
                            <Text style={{ fontSize: hp(2) }} className="flex-1 font-bold text-neutral-700">
                                Recipe Video
                            </Text>
                            <View>
                                <YouTubeIframe
                                    videoId={getYoutubeVideoId(meal.strYoutube)}
                                    height={hp(30)}
                                />
                            </View>
                        </Animated.View>
                    )}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({})

export default RecipeDetails;

import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BellIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Categories from '../components/Categories';
import Loader from '../components/Loader';
import Recipes from '../components/Recipes';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {

    const navigation = useNavigation();

    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("Beef");
    const [meals, setMeals] = useState([]);
    const [query, setQuery] = useState("");
    const [filteredMeals, setFilteredMeals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getCateories();
        getRecipes();
    }, []);

    const getCateories = async () => {
        try {

            const res = await axios.get("https://themealdb.com/api/json/v1/1/categories.php");

            if (res && res.data) {
                setCategories(res.data.categories);
            }

        } catch (error) {
            console.log(error);
        }
    };

    const getRecipes = async (category = "Beef") => {
        try {
            setIsLoading(true);

            const response = await axios.get(`https://themealdb.com/api/json/v1/1/filter.php?c=${category}`);
            if (response && response.data) {
                setMeals(response.data.meals);
                setFilteredMeals(response.data.meals);
            }

        } catch (err) {
            console.log('error: ', err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (text) => {
        setLoading(true);
        setQuery(text);

        const filtered = meals.filter((meal) => {
            const words = text.toLowerCase().split(' ');
            return words.some((word) => meal.strMeal.toLowerCase().trim().includes(word));
        });

        setFilteredMeals(filtered);
        setLoading(false);
    };

    const handleCategoryChange = (category) => {
        getRecipes(category);
        setActiveCategory(category);
        setMeals([]);
    };



    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
                className="space-y-6 pt-14"
            >
                {/* Header */}
                <View className="flex-row items-center justify-between mx-4 mb-2">
                    <Image source={require('../../assets/images/avatar.png')} style={{ height: hp(5), width: hp(5.5) }} />
                    <BellIcon color="gray" size={hp(4)} />
                </View>

                {/* Greetings */}
                <View className="mx-4 mb-2 space-y-2">
                    <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-600">
                        Hello there,
                    </Text>
                    <View>
                        <Text style={{ fontSize: hp(3.8) }} className="font-medium text-neutral-600">
                            Make your own food,
                        </Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: hp(3.8) }} className="font-medium text-neutral-600">
                            like a <Text className="text-amber-400">
                                Pro
                            </Text>
                        </Text>
                    </View>
                </View>

                {/* Search */}
                <View className="mx-4 flex-row items-center rounded-full bg-black/5 p-1.5">
                    <TextInput
                        placeholder="Search for recipes"
                        placeholderTextColor="gray"
                        style={{ fontSize: hp(1.9), flex: 1 }}
                        value={query}
                        onChangeText={(text) => handleSearch(text)}
                        className="flex-1 pl-4 text-base tracking-wider"
                    />
                    <View className="p-3 bg-white rounded-full">
                        <MagnifyingGlassIcon color="gray" size={hp(2.5)} strokeWidth={3} />
                    </View>
                </View>

                {/* Search Results */}
                {query && (
                    <View className="w-full my-4">
                        {loading && (
                            <Loader size="large" className="mt-12" />
                        )}
                        <FlatList
                            horizontal={true}
                            data={filteredMeals}
                            keyExtractor={(item) => item.idMeal}
                            contentContainerStyle={{ columnGap: 12, marginHorizontal: 16, paddingRight: 16 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('RecipeDetails', { ...item })}
                                    className="flex flex-col items-center justify-center gap-y-2"
                                >
                                    <Image source={{ uri: item.strMealThumb }} style={{ width: 100, height: 100, borderRadius: 24 }} />
                                    <Text
                                        style={{ fontSize: hp(1.8) }}
                                        className="ml-2 font-medium text-neutral-600"
                                    >
                                        {item?.strMeal?.length > 12 ? item.strMeal.slice(0, 12) + "..." : item.strMeal}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                        {filteredMeals?.length === 0 && (
                            <View className="flex-row items-center justify-center">
                                <Text className="text-base text-center text-neutral-700">
                                    No results found
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Categories */}
                {query ? null : (
                    <View className={query ? "" : "space-y-6"}>
                        <View>
                            <Categories
                                categories={categories}
                                activeCategory={activeCategory}
                                handleCategoryChange={handleCategoryChange}
                            />
                            {categories?.length === 0 && (
                                <View className="flex-row items-center justify-center my-4">
                                    <Loader size="large" className="mt-4" />
                                </View>
                            )}
                        </View>

                        <View>
                            {meals?.length === 0 && !isLoading && (
                                <View className="flex-row items-center justify-center my-4">
                                    <Text className="text-center text-slate-600">
                                        No recipes found
                                    </Text>
                                </View>
                            )}
                            <Recipes meals={meals} categories={categories} />
                        </View>
                    </View>
                )}

            </ScrollView>
        </View>
    );
}

export default HomeScreen;

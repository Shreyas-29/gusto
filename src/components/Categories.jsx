import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Categories = ({ categories, activeCategory, handleCategoryChange }) => {
    return (
        <Animated.View entering={FadeInDown.duration(500).springify()}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="space-x-4"
                contentContainerStyle={{ paddingHorizontal: 15 }}
            >
                {categories?.map((category, index) => {

                    let isActive = activeCategory === category.strCategory;
                    let activeButtonClass = isActive ? "bg-amber-400" : "bg-black/10";

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleCategoryChange(category.strCategory)}
                            className="flex items-center space-y-1"
                        >
                            <View className={"rounded-full p-1.5 " + activeButtonClass}>
                                <Image
                                    source={{ uri: category.strCategoryThumb }}
                                    style={{ width: hp(6), height: hp(6), borderRadius: 500 }}
                                />
                            </View>
                            <Text style={{ fontSize: hp(1.6) }} className="font-medium text-neutral-600">
                                {category.strCategory}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({})

export default Categories;

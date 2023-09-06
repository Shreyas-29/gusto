import React from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';

const SearchResults = (filteredMeals) => {
    return (
        <View className="w-full my-4">
            <FlatList
                horizontal={true}
                data={filteredMeals}
                keyExtractor={(item) => item.idMeal}
                renderItem={({ item }) => (
                    <View className="flex flex-col items-center justify-center gap-y-2">
                        <Image source={{ uri: item.strMealThumb }} style={{ width: 100, height: 100, borderRadius: 24 }} />
                        <Text>{item.strMeal}</Text>
                    </View>
                )}
            />
        </View>
    );
}


export default SearchResults;

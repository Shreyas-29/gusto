import MasonryList from '@react-native-seoul/masonry-list';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from './Loader';

const Recipies = ({ meals, categories }) => {

    const navigation = useNavigation();

    return (
        <View className="mx-4 space-y-3">
            {categories?.length > 0 && meals?.length > 0 ? (
                <>
                    <Text style={{ fontSize: hp(3) }} className="font-semibold text-neutral-600">Recipies</Text>

                    <View>
                        <MasonryList
                            data={meals}
                            keyExtractor={(item) => item.idMeal}
                            numColumns={2}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, i }) => <RecipeCard item={item} index={i} navigation={navigation} />}
                            onEndReachedThreshold={0.1}
                        />
                    </View>
                </>
            ) : (
                <Loader size="large" className="mt-28" />
            )}
        </View>
    );
}

export default Recipies;

const RecipeCard = ({ item, index, navigation }) => {

    let isEven = index % 2 === 0;

    return (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(600).springify().damping(12)}>
            <Pressable
                style={{ width: "100%", paddingLeft: isEven ? 0 : 8, paddingRight: isEven ? 8 : 0 }}
                className="flex justify-center mb-4 space-y-1"
                onPress={() => navigation.navigate('RecipeDetails', { ...item })}
            >
                <Animated.Image
                    source={{ uri: item?.strMealThumb }}
                    style={{ width: '100%', height: index % 3 == 0 ? hp(25) : hp(35), borderRadius: 35 }}
                    className="bg-black/5"
                    sharedTransitionTag={item.strMeal}
                />
                <Text
                    style={{ fontSize: hp(1.8) }}
                    className="ml-2 font-medium text-neutral-600">
                    {item?.strMeal?.length > 20 ? item.strMeal.slice(0, 20) + "..." : item.strMeal}
                </Text>
            </Pressable>
        </Animated.View>
    )
};
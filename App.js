import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView,
    ActivityIndicator, Alert, SafeAreaView, Platform, StatusBar, Modal, Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://172.20.10.4:4000/v1';
// change 'http://YOUROWNIPADDRESS:4000/v1' as needed
const NATIONALITIES = [
    { name: 'Italy', flag: '🇮🇹' },
    { name: 'France', flag: '🇫🇷' },
    { name: 'India', flag: '🇮🇳' },
    { name: 'USA', flag: '🇺🇸' },
    { name: 'Japan', flag: '🇯🇵' },
];
const getNation = v => NATIONALITIES.find(n => n.name === v) || { name: v, flag: '🌍' };

const RatingStars = ({ count, total }) => (
    <View style={styles.ratingStars}>
        {[1,2,3,4,5].map(i => (
            <Text key={i} style={styles.starIcon}>
                {i <= count ? '⭐' : '☆'}
            </Text>
        ))}
    </View>
);

const PressableStars = ({ value, onPress, disabled }) => (
    <View style={styles.pressableStars}>
        {[1,2,3,4,5].map(i => (
            <TouchableOpacity key={i} onPress={() => !disabled && onPress(i)} disabled={disabled}>
                <Text style={[styles.starIcon, disabled && styles.disabledStar]}>
                    {i <= value ? '⭐' : '☆'}
                </Text>
            </TouchableOpacity>
        ))}
    </View>
);

export default function App() {
    const [nationality, setNationality] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [dish, setDish] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [ratingCountry, setRatingCountry] = useState('Italy');
    const [ratingCountryModal, setRatingCountryModal] = useState(false);
    const [ingredientsExpanded, setIngredientsExpanded] = useState(false);
    const [submittingRating, setSubmittingRating] = useState(false);
    const [userRatings, setUserRatings] = useState({}); // { dishName: { nationality: rating } }
    
    // Add scroll position tracking
    const scrollViewRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    // On mount, clear nationality and load Pizza Margherita with Italian rating
    useEffect(() => {
        AsyncStorage.removeItem('userNationality').then(() => setNationality(''));
        AsyncStorage.removeItem('userRatings').then(() => setUserRatings({}));
        fetchDefaultDish();
    }, []);

    // Reset user rating when nationality changes
    useEffect(() => {
        setUserRating(0);
    }, [nationality]);

    // Load user rating when dish or nationality changes
    useEffect(() => {
        if (dish) {
            const rating = userRatings[dish.name]?.[nationality] || 0;
            setUserRating(rating);
        }
    }, [dish, nationality, userRatings]);

    const fetchDefaultDish = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/dishes/Pizza Margherita`, {
                headers: { 'X-User-Nationality': 'Italy' }
            });
            if (res.ok) {
                const data = await res.json();
                setDish(data.data);
            } else {
                setDish(null);
            }
        } catch {
            setDish(null);
        } finally {
            setLoading(false);
        }
    };

    const saveNationality = async name => {
        const n = getNation(name);
        await AsyncStorage.setItem('userNationality', n.name);
        setNationality(n.name);
        setModalVisible(false);
    };

    const searchDish = async (query) => {
        const dishName = query || searchQuery;
        if (!dishName.trim()) return;
        setLoading(true);
        setIngredientsExpanded(false); // Reset expansion when searching new dish
        try {
            const res = await fetch(`${API_BASE_URL}/dishes/${dishName}`, {
                headers: { 'X-User-Nationality': 'Italy' }
            });
            if (res.ok) {
                const data = await res.json();
                setDish(data.data);
            } else {
                setDish(null);
                Alert.alert('Not Found', 'Dish not found. Please try another name.');
            }
        } catch {
            Alert.alert('Error', 'Failed to search dish. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchDishForCountry = async (country) => {
        if (!dish) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/dishes/${dish.name}`, {
                headers: { 'X-User-Nationality': country }
            });
            if (res.ok) {
                const data = await res.json();
                setDish(data.data);
                // Restore scroll position after data loads
                setTimeout(() => {
                    scrollViewRef.current?.scrollTo({ y: scrollPosition, animated: false });
                }, 100);
            }
        } catch {
            // Handle error silently
        } finally {
            setLoading(false);
        }
    };

    const submitFeedback = async type => {
        const nat = nationality || 'Italy';
        try {
            const res = await fetch(`${API_BASE_URL}/dishes/${dish.name}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-User-Nationality': nat },
                body: JSON.stringify({ feedback: type }),
            });
            if (res.ok) {
                Alert.alert('Success', 'Thank you for your feedback!');
                searchDish(dish.name);
            }
        } catch {
            Alert.alert('Error', 'Failed to submit feedback.');
        }
    };

    const submitRating = async (rating) => {
        if (!dish || !nationality || !rating || submittingRating) return;
        
        setSubmittingRating(true);
        try {
            // Update local ratings state
            setUserRatings(prev => ({
                ...prev,
                [dish.name]: {
                    ...prev[dish.name],
                    [nationality]: rating
                }
            }));

            // Convert star rating to like/dislike feedback
            const feedback = rating >= 3 ? 'like' : 'dislike';
            
            const res = await fetch(`${API_BASE_URL}/dishes/${dish.name}/feedback`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'X-User-Nationality': nationality 
                },
                body: JSON.stringify({ feedback }),
            });
            
            if (res.ok) {
                if (!userRatings[dish.name]?.[nationality] && nationality === ratingCountry) {
                    setDish(prevDish => ({
                        ...prevDish,
                        like: feedback === 'like' ? prevDish.like + 1 : prevDish.like,
                        dislike: feedback === 'dislike' ? prevDish.dislike + 1 : prevDish.dislike
                    }));
                }
                                
                setUserRating(rating);
            } else {
                Alert.alert('Error', 'Failed to submit rating. Please try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to submit rating. Please try again.');
        } finally {
            setSubmittingRating(false);
        }
    };

    const handleRatingPress = (rating) => {
        setUserRating(rating);
        // Auto-submit the rating after a short delay to allow user to see their selection
        setTimeout(() => {
            submitRating(rating);
        }, 500);
    };

    const getRatingPercentage = () => {
        if (!dish || (dish.like === 0 && dish.dislike === 0)) {
            // Return a random percentage between 50-95% for initial display
            return Math.floor(Math.random() * 45) + 50;
        }
        const total = dish.like + dish.dislike;
        return ((dish.like / total) * 100).toFixed(0);
    };

    const getStarRating = () => {
        const p = getRatingPercentage();
        if (p === null) return 0;
        if (p >= 90) return 5;
        if (p >= 70) return 4;
        if (p >= 50) return 3;
        if (p >= 30) return 2;
        return 1;
    };

    const getTotalRatings = () => {
        if (!dish || (dish.like === 0 && dish.dislike === 0)) {
            return Math.floor(Math.random() * 185) + 15; // Random between 15-200
        }
        return dish.like + dish.dislike;
    };

    const getSpecifications = () => {
        if (!dish) return [];

        const specs = [];
        const ingredients = dish.ingredients.map(i => i.name.toLowerCase());
        const dishName = dish.name.toLowerCase();

        // Vegetarian
        const nonVegItems = ['meat', 'beef', 'pork', 'chicken', 'fish', 'seafood', 'shrimp', 'bacon', 'sausage', 'ham', 'lamb', 'salmon', 'tuna'];
        const isVegetarian = !ingredients.some(i => nonVegItems.some(n => i.includes(n)));
        if (isVegetarian) specs.push({ label: 'Vegetarian', icon: '✅' });

        // Vegan
        const animalProducts = ['egg', 'milk', 'cheese', 'butter', 'yogurt', 'cream', 'honey'];
        const isVegan = isVegetarian && !ingredients.some(i => animalProducts.some(n => i.includes(n)));
        if (isVegan) specs.push({ label: 'Vegan', icon: '🌱' });

        // Kosher
        const containsPorkOrShellfish = ingredients.some(i => ['pork', 'shrimp', 'lobster', 'clam', 'bacon'].some(n => i.includes(n)));
        const containsMeat = ingredients.some(i => ['beef', 'chicken', 'lamb'].some(n => i.includes(n)));
        const containsDairy = ingredients.some(i => ['cheese', 'milk', 'butter'].some(n => i.includes(n)));
        const isKosher = !containsPorkOrShellfish && !(containsMeat && containsDairy);
        if (isKosher) specs.push({ label: 'Kosher', icon: '✅' });

        // Halal
        const isHalal = !ingredients.some(i => ['pork', 'alcohol', 'ham', 'bacon', 'wine'].some(n => i.includes(n)));
        if (isHalal) specs.push({ label: 'Halal', icon: '✅' });

        // Gluten-free
        const glutenItems = ['wheat', 'barley', 'rye', 'semolina', 'spelt', 'gluten'];
        const isGlutenFree = !ingredients.some(i => glutenItems.some(n => i.includes(n)));
        if (isGlutenFree) specs.push({ label: 'Gluten-free', icon: '✅' });

        return specs;
    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            
            {/* Top Bar */}
            <TouchableOpacity style={styles.topBar} onPress={() => setModalVisible(true)}>
                <View style={styles.topBarContent}>
                    <Text style={styles.topBarText}>
                        My nationality is {nationality ? `${getNation(nationality).name} ${getNation(nationality).flag}` : '...'}
                    </Text>
                    <Text style={styles.topBarArrow}>▼</Text>
                </View>
            </TouchableOpacity>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Type the dish name"
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={() => {
                        searchDish();
                        setSearchQuery('');
                        Keyboard.dismiss();
                    }}
                    returnKeyType="search"
                />
                <TouchableOpacity
                    onPress={() => {
                        searchDish();
                        setSearchQuery('');
                        Keyboard.dismiss();
                    }}
                    style={styles.searchButton}
                >
                    <Text style={styles.searchIcon}>🔍</Text>
                </TouchableOpacity>
            </View>

            {/* Nationality Selection Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Choose your nationality</Text>
                        {NATIONALITIES.map(nat => (
                            <TouchableOpacity
                                key={nat.name}
                                style={styles.nationalityOption}
                                onPress={() => saveNationality(nat.name)}
                            >
                                <Text style={styles.nationalityText}>{nat.flag} {nat.name}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Rating Country Modal */}
            <Modal
                visible={ratingCountryModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setRatingCountryModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Choose country for rating</Text>
                        {NATIONALITIES.map(nat => (
                            <TouchableOpacity
                                key={nat.name}
                                style={styles.nationalityOption}
                                onPress={async () => {
                                    setRatingCountry(nat.name);
                                    setRatingCountryModal(false);
                                    await fetchDishForCountry(nat.name);
                                }}
                            >
                                <Text style={styles.nationalityText}>{nat.flag} {nat.name}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity onPress={() => setRatingCountryModal(false)} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Main Content */}
            <ScrollView 
                ref={scrollViewRef}
                style={styles.content} 
                keyboardShouldPersistTaps="handled"
                onScroll={(event) => {
                    setScrollPosition(event.nativeEvent.contentOffset.y);
                }}
                scrollEventThrottle={16}
            >
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FF8C42" />
                    </View>
                )}

                {dish && !loading && (
                    <View style={styles.dishContainer}>
                        {/* Dish Image */}
                        <View style={styles.imageContainer}>
                            {dish.img ? (
                                <Image source={{ uri: dish.img }} style={styles.dishImage} />
                            ) : (
                                <View style={styles.placeholderImage}>
                                    <Text style={styles.placeholderEmoji}>🍽️</Text>
                                </View>
                            )}
                        </View>

                        {/* Dish Name */}
                        <Text style={styles.dishName}>{dish.name}</Text>

                        {/* Specifications */}
                        <View style={styles.specsContainer}>
                            {getSpecifications().map((spec, index) => (
                                <View key={index} style={styles.specBadge}>
                                    <Text style={styles.specText}>{spec.label}</Text>
                                    <Text style={styles.specCheck}>{spec.icon}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Description */}
                        {dish.description && (
                            <Text style={styles.description}>{dish.description}</Text>
                        )}

                        {/* Main Ingredients */}
                        <View style={styles.card}>
                            <TouchableOpacity 
                                style={styles.cardHeader}
                                onPress={() => setIngredientsExpanded(!ingredientsExpanded)}
                            >
                                <Text style={styles.cardTitle}>Main Ingredients:</Text>
                                <Text style={[styles.expandIcon, ingredientsExpanded && styles.expandIconRotated]}>
                                    {ingredientsExpanded ? '▲' : '▼'}
                                </Text>
                            </TouchableOpacity>
                            
                            {ingredientsExpanded ? (
                                <View style={styles.ingredientsExpanded}>
                                    {dish.ingredients.map((ingredient, index) => (
                                        <View key={index} style={styles.ingredientItem}>
                                            <Text style={styles.ingredientBullet}>•</Text>
                                            <Text style={styles.ingredientText}>{ingredient.name}</Text>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <Text style={styles.ingredientsList} numberOfLines={1} ellipsizeMode="tail">
                                    {dish.ingredients.map(i => i.name).join(', ')}
                                </Text>
                            )}
                        </View>

                        {/* Average Rating */}
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>Average rating</Text>
                                <TouchableOpacity
                                    style={styles.ratingHeaderRight}
                                    onPress={() => setRatingCountryModal(true)}
                                    hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
                                >
                                    <View style={styles.countrySelector}>
                                        <Text style={styles.countryFlag}>{getNation(ratingCountry).flag}</Text>
                                        <Text style={styles.expandIcon}>▼</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <RatingStars count={getStarRating()} total={getTotalRatings()} />
                            <Text style={styles.ratingFrom}>from users in {ratingCountry}</Text>
                        </View>

                        {/* Your Rating */}
                        <View style={[styles.card, !nationality && styles.disabledCard]}>
                            <View style={styles.cardHeader}>
                                <Text style={[styles.cardTitle, !nationality && styles.disabledText]}>
                                    Your rating
                                </Text>
                                {submittingRating && (
                                    <ActivityIndicator size="small" color="#FF8C42" />
                                )}
                            </View>
                            <PressableStars 
                                value={userRating} 
                                onPress={handleRatingPress} 
                                disabled={!nationality || submittingRating}
                            />
                            {!nationality ? (
                                <Text style={styles.disabledMessage}>
                                    Please choose your nationality to rate
                                </Text>
                            ) : userRating > 0 ? (
                                <Text style={styles.ratingSubmittedMessage}>
                                    You rated this dish {userRating} star{userRating !== 1 ? 's' : ''}
                                </Text>
                            ) : (
                                <Text style={styles.ratingInstructionMessage}>
                                    Tap stars to rate this dish
                                </Text>
                            )}
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    topBar: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    topBarContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    topBarText: {
        fontSize: 16,
        color: '#FF8C42',
        fontWeight: '600',
        marginRight: 8,
    },
    topBarArrow: {
        fontSize: 16,
        color: '#FF8C42',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 15,
        backgroundColor: '#ffedc8',
        borderRadius: 25,
        paddingHorizontal: 15,
    },
    searchInput: {
        flex: 1,
        height: 45,
        fontSize: 16,
        color: '#333',
    },
    searchButton: {
        padding: 5,
    },
    searchIcon: {
        fontSize: 20,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    dishContainer: {
        paddingBottom: 30,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    dishImage: {
        width: '100%',
        height: 200,
        borderRadius: 15,
        resizeMode: 'cover',
    },
    placeholderImage: {
        width: '100%',
        height: 200,
        borderRadius: 15,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderEmoji: {
        fontSize: 60,
    },
    dishName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    specsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 15,
    },
    specBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#bbdc64',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 5,
    },
    specText: {
        color: '#000000',
        fontSize: 14,
        fontWeight: '600',
        marginRight: 5,
    },
    specCheck: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#FF8C42',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
    },
    disabledCard: {
        backgroundColor: '#F5F5F5',
        borderColor: '#DDD',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    disabledText: {
        color: '#999',
    },
    expandIcon: {
        fontSize: 16,
        color: '#FF8C42',
    },
    expandIconRotated: {
        transform: [{ rotate: '180deg' }],
    },
    ingredientsList: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    ingredientsExpanded: {
        paddingTop: 5,
    },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    ingredientBullet: {
        fontSize: 16,
        color: '#FF8C42',
        marginRight: 8,
        lineHeight: 20,
    },
    ingredientText: {
        fontSize: 14,
        color: '#666',
        flex: 1,
        lineHeight: 20,
    },
    ratingStars: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    pressableStars: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starIcon: {
        fontSize: 24,
        marginRight: 5,
    },
    disabledStar: {
        opacity: 0.5,
    },
    ratingTotal: {
        fontSize: 16,
        color: '#666',
        marginLeft: 10,
    },
    countrySelector: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    countryFlag: {
        fontSize: 20,
        marginRight: 5,
    },
    ratingFrom: {
        fontSize: 14,
        color: '#666',
    },
    disabledMessage: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
        marginTop: 5,
    },
    ratingSubmittedMessage: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '500',
        marginTop: 5,
    },
    ratingInstructionMessage: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 30,
        width: '85%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    nationalityOption: {
        backgroundColor: '#F5F5F5',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    nationalityText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#333',
    },
    cancelButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 16,
        color: '#FF8C42',
        fontWeight: '600',
    },
    ratingHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

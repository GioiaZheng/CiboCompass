import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView,
    ActivityIndicator, Alert, SafeAreaView, Platform, StatusBar, Modal, Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://172.20.10.4:4000/v1';
const NATIONALITIES = [
    { name: 'Italy', flag: '🇮🇹' },
    { name: 'France', flag: '🇫🇷' },
    { name: 'India', flag: '🇮🇳' },
    { name: 'USA', flag: '🇺🇸' },
    { name: 'Japan', flag: '🇯🇵' },
];
const getNation = v => NATIONALITIES.find(n => n.name === v) || { name: v, flag: '🌍' };

const RatingStars = ({ count }) => (
    <Text style={styles.star}>{[...Array(5)].map((_, i) => i < count ? '⭐' : '☆').join(' ')}</Text>
);

const PressableStars = ({ value, onPress }) => (
    <View style={styles.ratingStars}>
        {[1,2,3,4,5].map(i => (
            <TouchableOpacity key={i} onPress={() => onPress(i)}>
                <Text style={styles.star}>{i <= value ? '⭐' : '☆'}</Text>
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
    const [shuffledSpecs, setShuffledSpecs] = useState(SPECS);

    // On mount, clear nationality and load Pizza Margherita with Italian rating
    useEffect(() => {
        AsyncStorage.removeItem('userNationality').then(() => setNationality(''));
        fetchDefaultDish();
        setShuffledSpecs(shuffleArray(SPECS));
    }, []);

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

    // Always use "Italy" for rating/nationality when fetching dish details
    const searchDish = async (query) => {
        const dishName = query || searchQuery;
        if (!dishName.trim()) return;
        setLoading(true);
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

    // Use chosen nationality for feedback, fallback to Italy
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
                searchDish(dish.name); // reload with Italian rating
            }
        } catch {
            Alert.alert('Error', 'Failed to submit feedback.');
        }
    };

    const getRatingPercentage = () => {
        if (!dish || (dish.like === 0 && dish.dislike === 0)) return null;
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

    const n = getNation(nationality);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF5E9" />
            {/* Top Bar Nationality Chooser */}
            <TouchableOpacity style={styles.natBar} onPress={() => setModalVisible(true)}>
                <Text style={styles.natBarText}>
                    My nationality is{' '}
                    {nationality
                        ? `${getNation(nationality).name} ${getNation(nationality).flag}`
                        : '...'}
                </Text>
                <Text style={styles.natBarArrow}>
                    {nationality ? '▼' : '🏴 ▼'}
                </Text>
            </TouchableOpacity>
            {/* Centered Search Input just below top bar */}
            <View style={styles.searchInputContainer}>
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
            {/* Modal for nationality selection */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.sectionTitle}>Choose your nationality</Text>
                        {NATIONALITIES.map(nat => (
                            <TouchableOpacity
                                key={nat.name}
                                style={styles.nationalityOption}
                                onPress={() => saveNationality(nat.name)}
                            >
                                <Text style={styles.nationalityText}>{nat.flag} {nat.name}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={{marginTop: 20}}>
                            <Text style={{color: '#FF8C42', fontSize: 18}}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* Modal for rating country selection */}
            <Modal
                visible={ratingCountryModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setRatingCountryModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.sectionTitle}>Choose country for rating</Text>
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
                        <TouchableOpacity onPress={() => setRatingCountryModal(false)} style={{marginTop: 20}}>
                            <Text style={{color: '#FF8C42', fontSize: 18}}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <ScrollView style={styles.dishDetailsContainer} keyboardShouldPersistTaps="handled">
                {/* Dish Details */}
                {dish && (
                    <>
                        <View style={styles.dishImageContainer}>
                            {dish.img ? <Image source={{ uri: dish.img }} style={styles.dishImage} /> : <Text style={styles.dishEmoji}>🍽️</Text>}
                        </View>
                        <Text style={styles.dishName}>{dish.name}</Text>
                        {/* Specification tags */}
                        <View style={styles.specsRow}>
                            {shuffledSpecs.map(spec => (
                                <View style={styles.specBox} key={spec.label}>
                                    <Text style={styles.specText}>{spec.label}</Text>
                                    <Text style={styles.specTick}>{spec.icon}</Text>
                                </View>
                            ))}
                        </View>
                        {dish.description ? (
                            <Text style={styles.dishDescription}>{dish.description}</Text>
                        ) : null}
                        <View style={styles.ingredientSection}>
                            <View style={styles.ingredientRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.ingredientsTitle}>Ingredients:</Text>
                                    <Text style={styles.ingredientsList} numberOfLines={1} ellipsizeMode="tail">
                                        {dish.ingredients.map(i => i.name).join(', ')}
                                    </Text>
                                </View>
                                <Text style={styles.downArrow}>▼</Text>
                            </View>
                        </View>
                        <View style={styles.ratingBox}>
                            <Text style={styles.ratingTitle}>Average rating:</Text>
                            <View style={styles.ratingBoxRow}>
                                <View style={styles.ratingStars}>
                                    <RatingStars count={getStarRating()} />
                                    <Text style={styles.ratingCount}>
                                        ({(dish.like + dish.dislike) || 0})
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center' }}
                                    onPress={() => setRatingCountryModal(true)}
                                >
                                    <Text style={styles.ratingFlag}>{getNation(ratingCountry).flag}</Text>
                                    <Text style={styles.ratingArrow}>▼</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.ratingFrom}>
                                from users in {ratingCountry}
                            </Text>
                        </View>
                        <View style={[
    styles.ratingBox,
    !nationality && { backgroundColor: '#F44336' } // red if not chosen
]}>
    <Text style={[
        styles.ratingTitle,
        !nationality && { color: '#fff' } // white text if red background
    ]}>
        Your rating:
    </Text>
    <View style={styles.ratingBoxRow}>
        {nationality ? (
            <PressableStars value={userRating} onPress={setUserRating} />
        ) : (
            <View style={styles.ratingStars}>
                {[1,2,3,4,5].map(i => (
                    <Text key={i} style={[styles.star, { color: '#fff' }]}>☆</Text>
                ))}
            </View>
        )}
    </View>
    {!nationality && (
        <Text style={{ color: '#fff', marginTop: 6, fontStyle: 'italic', textAlign: 'center' }}>
            Please choose your nationality to rate
        </Text>
    )}
</View>
                        {/* Removed like/dislike buttons here */}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const SPECS = [
    { label: 'Vegetarian', icon: '✔️' },
    { label: 'Gluten Free', icon: '✔️' },
    { label: 'Lactose Free', icon: '✔️' },
];

function shuffleArray(array) {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF5E9',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    welcomeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    welcomeText: {
        fontSize: 32,
        color: '#FF8C42',
        marginBottom: 10,
    },
    logoImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 40,
        borderRadius: 50,
        overflow: 'hidden', 
    },
    appName: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FF8C42',
        marginBottom: 40,
    },
    continueButton: {
        backgroundColor: '#FF8C42',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
        zIndex: 1,
        elevation: 5,
    },
    continueButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    nationalityContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    sectionTitle: {
        fontSize: 28,
        color: '#FF8C42',
        textAlign: 'center',
        marginBottom: 40,
        fontWeight: '600',
    },
    nationalityOption: {
        backgroundColor: '#FFE4CC',
        padding: 15,
        marginVertical: 8,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    nationalityText: {
        fontSize: 20,
        textAlign: 'center',
    },
    searchContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    nationalityHeader: {
        position: 'absolute',
        top: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFE4CC',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    nationalityHeaderText: {
        fontSize: 16,
        color: '#FF8C42',
    },
    nationalityFlag: {
        fontSize: 24,
    },
    changeText: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
    },
    searchTitle: {
        fontSize: 48,
        color: '#FF8C42',
        fontWeight: 'bold',
    },
    searchSubtitle: {
        fontSize: 32,
        color: '#FF8C42',
        marginVertical: 10,
    },
    searchInputContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFE4CC',
        borderRadius: 25,
        paddingHorizontal: 20,
        alignItems: 'center',
        width: '90%',
        maxWidth: 350,
        alignSelf: 'center',      // Center horizontally
        marginTop: 10,            // Closer to top bar
        marginBottom: 10,         // Optional: space below
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    searchButton: {
        padding: 10,
    },
    searchIcon: {
        fontSize: 20,
    },
    loader: {
        marginTop: 20,
    },
    dishDetailsContainer: {
        flex: 1,
        padding: 20,
    },
    backButton: {
        marginBottom: 20,
    },
    backLink: {
        color: '#FF8C42',
        fontSize: 16,
    },
    dishImageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    dishEmoji: {
        fontSize: 100,
    },
    dishImage: {
        width: 320,      // wider image
        height: 180,     // similar height
        borderRadius: 10,
    },
    dishName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000', // changed from '#FF8C42' to black
        textAlign: 'center',
        marginBottom: 20,
    },
    dishDescription: {
        fontSize: 16,
        color: '#444',
        textAlign: 'left', // changed from 'center' to 'left'
        marginBottom: 18,
        marginHorizontal: 10,
    },
    ingredientSection: {
        backgroundColor: '#FFF',           // white inner part
        borderColor: '#FF8C42',            // orange border
        borderWidth: 2,                    // border thickness
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        marginBottom: 20,
        minHeight: 40,
        maxHeight: 60,
        justifyContent: 'center',
    },
    ingredientRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ingredientsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    ingredientsList: {
        fontSize: 14,
        color: '#666',
    },
    downArrow: {
        fontSize: 20,
        color: '#FF8C42',
        marginLeft: 10,
    },
    ratingBox: {
        backgroundColor: '#FFF',
        borderColor: '#FF8C42',
        borderWidth: 2,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        marginBottom: 20,
        minHeight: 40,
        maxHeight: 80,
        justifyContent: 'center',
    },
    ratingBoxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    ratingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    stars: {
        marginBottom: 10,
    },
    star: {
        fontSize: 24,
    },
    ratingPercentage: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
    },
    noRating: {
        fontSize: 16,
        color: '#999',
        marginBottom: 5,
    },
    beFirst: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
        marginBottom: 15,
    },
    feedbackButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        marginBottom: 40,
    },
    feedbackButton: {
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        width: '40%',
        alignItems: 'center',
    },
    likeButton: {
        backgroundColor: '#4CAF50',
    },
    dislikeButton: {
        backgroundColor: '#F44336',
    },
    feedbackButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    topBar: {
        backgroundColor: '#FFE4CC',
        paddingVertical: 8,
        paddingHorizontal: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#FF8C42',
    },
    topBarScroll: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    topBarNationalityOption: {
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 20,
        marginHorizontal: 5,
        backgroundColor: '#FFF5E9',
    },
    topBarNationalitySelected: {
        backgroundColor: '#FF8C42',
    },
    topBarNationalityText: {
        fontSize: 18,
        color: '#FF8C42',
        fontWeight: 'bold',
    },
    natBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end', // shift content to the right
        backgroundColor: '#FFE4CC',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#FF8C42',
    },
    natBarText: {
        fontSize: 18,
        color: '#FF8C42', // changed from '#222' to orange
        fontWeight: 'bold',
        textAlign: 'right',
    },
    natBarArrow: {
        fontSize: 22,
        color: '#FF8C42', // changed from '#222' to orange
        marginLeft: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFF5E9',
        borderRadius: 16,
        padding: 30,
        width: '80%',
        alignItems: 'center',
        elevation: 10,
    },
    ratingStars: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingFlag: {
        fontSize: 24,
        marginLeft: 10,
    },
    ratingArrow: {
        fontSize: 20,
        color: '#FF8C42',
        marginLeft: 5,
    },
    ratingFrom: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
        textAlign: 'left',
    },
    ratingCount: {
        fontSize: 16,
        color: '#666',
        marginLeft: 10,
    },
    specsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap', // allow boxes to wrap to next line
        justifyContent: 'center',
        marginBottom: 10,
        gap: 8, // if not supported, use marginRight on specBox except last
    },
    specBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8FD694', // darker salad/light green
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginHorizontal: 2,
        minWidth: 80,
        marginBottom: 6,
        justifyContent: 'space-between',
    },
    specText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    specTick: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
    },
});
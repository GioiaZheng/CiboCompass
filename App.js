import React, { useState, useEffect } from 'react';
import {
	StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView,
	ActivityIndicator, Alert, SafeAreaView, Platform, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


AsyncStorage.removeItem('userNationality');

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

const Comments = ({ comments }) => (
	<View style={{ marginTop: 30 }}>
		<Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FF8C42', marginBottom: 10 }}>Comments</Text>
		{comments && comments.length > 0 ? comments.map((c, i) => (
			<View key={i} style={{ backgroundColor: '#FFE4CC', borderRadius: 10, padding: 12, marginBottom: 8 }}>
				<Text style={{ color: '#333', fontSize: 16 }}>{typeof c === 'string' ? c : c.text}</Text>
			</View>
		)) : <Text style={{ color: '#999', fontStyle: 'italic' }}>No comments yet.</Text>}
	</View>
);

export default function App() {
	const [screen, setScreen] = useState('welcome');
	const [nationality, setNationality] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [dish, setDish] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => { AsyncStorage.getItem('userNationality').then(n => n && (setNationality(n), setScreen('search'))); }, []);

	const saveNationality = async name => {
		const n = getNation(name);
		await AsyncStorage.setItem('userNationality', n.name);
		setNationality(n.name);
		setScreen('search');
	};

	const searchDish = async () => {
		if (!searchQuery.trim()) return;
		setLoading(true);
		try {
			const res = await fetch(`${API_BASE_URL}/dishes/${searchQuery}`, { headers: { 'X-User-Nationality': nationality } });
			if (res.ok) {
				const data = await res.json();
				setDish(data.data);
				setScreen('dishDetails');
			} else Alert.alert('Not Found', 'Dish not found. Please try another name.');
		} catch {
			Alert.alert('Error', 'Failed to search dish. Please try again.');
		} finally { setLoading(false); }
	};

	const submitFeedback = async type => {
		try {
			const res = await fetch(`${API_BASE_URL}/dishes/${dish.name}/feedback`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', 'X-User-Nationality': nationality },
				body: JSON.stringify({ feedback: type }),
			});
			if (res.ok) { Alert.alert('Success', 'Thank you for your feedback!'); searchDish(); }
		} catch { Alert.alert('Error', 'Failed to submit feedback.'); }
	};

	const submitComment = async comment => {
		try {
			const res = await fetch(`${API_BASE_URL}/dishes/${dish.name}/comment`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', 'X-User-Nationality': nationality },
				body: JSON.stringify({ comment }),
			});
			if (res.ok) Alert.alert('Success', 'Comment added successfully!');
		} catch { Alert.alert('Error', 'Failed to submit comment.'); }
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

	if (screen === 'welcome') return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor="#FFF5E9" />
			<View style={styles.welcomeContainer}>
				<Text style={styles.welcomeText}>Welcome to</Text>
				<Text style={styles.appName}>CiboCompass</Text>
				<Image source={require('./assets/logo.png')} style={styles.logoImage} />
				<TouchableOpacity style={styles.continueButton} onPress={() => setScreen('nationality')} activeOpacity={0.7}>
					<Text style={styles.continueButtonText}>Continue</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);

	if (screen === 'nationality') return (
		<SafeAreaView style={styles.container}>
			<View style={styles.nationalityContainer}>
				<Text style={styles.sectionTitle}>Choose your{'\n'}nationality</Text>
				{NATIONALITIES.map(n => (
					<TouchableOpacity key={n.name} style={styles.nationalityOption} onPress={() => saveNationality(n.name)}>
						<Text style={styles.nationalityText}>{n.flag} {n.name}</Text>
					</TouchableOpacity>
				))}
			</View>
		</SafeAreaView>
	);

	if (screen === 'search') {
		const n = getNation(nationality);
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.searchContainer}>
					<TouchableOpacity style={styles.nationalityHeader} onPress={() => setScreen('nationality')}>
						<Text style={styles.nationalityFlag}>{n.flag}</Text>
					</TouchableOpacity>
					<Text style={styles.searchTitle}>search</Text>
					<Text style={styles.searchSubtitle}>or</Text>
					<Text style={styles.searchTitle}>starve</Text>
					<View style={styles.searchInputContainer}>
						<TextInput
							style={styles.searchInput}
							placeholder="Type the dish name"
							placeholderTextColor="#999"
							value={searchQuery}
							onChangeText={setSearchQuery}
							onSubmitEditing={searchDish}
						/>
						<TouchableOpacity onPress={searchDish} style={styles.searchButton}>
							<Text style={styles.searchIcon}>🔍</Text>
						</TouchableOpacity>
					</View>
					{loading && <ActivityIndicator size="large" color="#FF8C42" style={styles.loader} />}
				</View>
			</SafeAreaView>
		);
	}

	if (screen === 'dishDetails' && dish) {
		const n = getNation(nationality);
		const ratingPercentage = getRatingPercentage();
		const starCount = getStarRating();
		return (
			<SafeAreaView style={styles.container}>
				<ScrollView style={styles.dishDetailsContainer}>
					<TouchableOpacity onPress={() => setScreen('search')} style={styles.backButton}>
						<Text style={styles.backLink}>← Home Page</Text>
					</TouchableOpacity>
					<View style={styles.dishImageContainer}>
						{dish.img ? <Image source={{ uri: dish.img }} style={styles.dishImage} /> : <Text style={styles.dishEmoji}>🍽️</Text>}
					</View>
					<Text style={styles.dishName}>{dish.name}</Text>
					<View style={styles.ingredientSection}>
						<Text style={styles.ingredientsTitle}>Ingredients:</Text>
						<Text style={styles.ingredientsList}>{dish.ingredients.map(i => i.name).join(', ')}</Text>
					</View>
					<View style={styles.ratingSection}>
						<Text style={styles.ratingTitle}>Average rating from users in {n.name} {n.flag}</Text>
						{ratingPercentage !== null ? (
							<>
								<View style={styles.stars}><RatingStars count={starCount} /></View>
								<Text style={styles.ratingPercentage}>{ratingPercentage}% positive ({dish.like} 👍 / {dish.dislike} 👎)</Text>
							</>
						) : (
							<>
								<Text style={styles.noRating}>No ratings yet</Text>
								<Text style={styles.beFirst}>Be the first to rate this dish!</Text>
							</>
						)}
					</View>
					<View style={styles.feedbackButtons}>
						<TouchableOpacity style={[styles.feedbackButton, styles.likeButton]} onPress={() => submitFeedback('like')}>
							<Text style={styles.feedbackButtonText}>👍 Like</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.feedbackButton, styles.dislikeButton]} onPress={() => submitFeedback('dislike')}>
							<Text style={styles.feedbackButtonText}>👎 Dislike</Text>
						</TouchableOpacity>
					</View>
					<Comments comments={dish.comments} />
				</ScrollView>
			</SafeAreaView>
		);
	}

	return null;
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
	marginTop: 40,
	backgroundColor: '#FFE4CC',
	borderRadius: 25,
	paddingHorizontal: 20,
	alignItems: 'center',
	width: '100%',
	maxWidth: 350,
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
	width: 200,
	height: 200,
	borderRadius: 10,
},
dishName: {
	fontSize: 32,
	fontWeight: 'bold',
	color: '#FF8C42',
	textAlign: 'center',
	marginBottom: 20,
},
ingredientSection: {
	backgroundColor: '#FFE4CC',
	padding: 20,
	borderRadius: 12,
	marginBottom: 20,
},
ingredientsTitle: {
	fontSize: 20,
	fontWeight: 'bold',
	marginBottom: 10,
	color: '#333',
},
ingredientsList: {
	fontSize: 16,
	marginBottom: 15,
	color: '#666',
},
ratingSection: {
	alignItems: 'center',
	marginVertical: 20,
},
ratingTitle: {
	fontSize: 18,
	marginBottom: 10,
	textAlign: 'center',
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
});
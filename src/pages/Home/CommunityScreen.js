import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Components
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';

// Context and Services
import { AppContext } from '../../services/AppContext';

// Mock data for the community feed
const MOCK_POSTS = [
  {
    id: '1',
    user: {
      id: '101',
      name: 'Jane Cooper',
      avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
    },
    content: "I've been using this app for 3 weeks and already completed my morning workout habit 18 times! Feeling stronger every day 💪",
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
    likes: 24,
    comments: 5,
    timestamp: '2 hours ago',
    isLiked: false,
  },
  {
    id: '2',
    user: {
      id: '102',
      name: 'Robert Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    content: "5 day meditation streak! This app has helped me stay consistent with my mindfulness practice. Anyone else meditating daily?",
    likes: 17,
    comments: 8,
    timestamp: '3 hours ago',
    isLiked: false,
  },
  {
    id: '3',
    user: {
      id: '103',
      name: 'Sarah Miller',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    content: "Just completed my 30-day water intake challenge! Drinking 8 glasses daily has become second nature now.",
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
    likes: 42,
    comments: 12,
    timestamp: '5 hours ago',
    isLiked: true,
  },
  {
    id: '4',
    user: {
      id: '104',
      name: 'Michael Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
    content: "Quick tip: I found that stacking new habits with existing routines has been a game-changer for consistency. I now read for 10 minutes right after brushing my teeth every night!",
    likes: 36,
    comments: 7,
    timestamp: '1 day ago',
    isLiked: false,
  },
  {
    id: '5',
    user: {
      id: '105',
      name: 'Emma Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    },
    content: "Morning routine challenge completed! ☀️ 21 days of waking up at 6 AM and it's changed my life. So much more productive now.",
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
    likes: 53,
    comments: 14,
    timestamp: '2 days ago',
    isLiked: false,
  }
];

const CommunityScreen = () => {
  const navigation = useNavigation();
  const { theme } = useContext(AppContext);
  
  // Local state
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [refreshing, setRefreshing] = useState(false);
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle like action
  const handleLike = (postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const isCurrentlyLiked = post.isLiked;
          return {
            ...post,
            isLiked: !isCurrentlyLiked,
            likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      })
    );
  };
  
  // Handle comment action
  const handleComment = (postId) => {
    Alert.alert(
      'Comments',
      'View and add comments',
      [
        {
          text: 'Close',
          style: 'cancel'
        },
        {
          text: 'Add Comment',
          onPress: () => {
            Alert.alert('Success', 'Comment added successfully');
            // In a real app, this would open a comment input modal or screen
          }
        }
      ]
    );
  };
  
  // Handle share action
  const handleShare = (postId) => {
    Alert.alert(
      'Share Post',
      'Share this post with friends',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Share',
          onPress: () => Alert.alert('Success', 'Post shared successfully')
        }
      ]
    );
  };
  
  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate fetching new data
    setTimeout(() => {
      // Shuffle the posts array to simulate new content
      setPosts([...posts].sort(() => Math.random() - 0.5));
      setRefreshing(false);
    }, 1500);
  };
  
  // Handle creating a new post
  const handleCreatePost = () => {
    if (!newPostText.trim()) {
      Alert.alert('Error', 'Please enter some text for your post');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate posting
    setTimeout(() => {
      const newPost = {
        id: Date.now().toString(),
        user: {
          id: 'current_user',
          name: 'You',
          avatar: 'https://randomuser.me/api/portraits/lego/1.jpg', // Placeholder avatar
        },
        content: newPostText,
        likes: 0,
        comments: 0,
        timestamp: 'Just now',
        isLiked: false,
      };
      
      setPosts([newPost, ...posts]);
      setNewPostText('');
      setIsPostModalVisible(false);
      setIsLoading(false);
      
      Alert.alert('Success', 'Your post has been shared with the community!');
    }, 1000);
  };
  
  // Render each post
  const renderPost = ({ item }) => (
    <Card style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <Image 
          source={{ uri: item.user.avatar }} 
          style={styles.userAvatar}
          defaultSource={require('../../../assets/images/icon.png')}
        />
        <View style={styles.postHeaderText}>
          <Text style={[styles.userName, { color: theme.text }]}>{item.user.name}</Text>
          <Text style={[styles.postTime, { color: theme.text + '80' }]}>{item.timestamp}</Text>
        </View>
        <TouchableOpacity style={styles.moreOptions}>
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.text + '80'} />
        </TouchableOpacity>
      </View>
      
      {/* Post Content */}
      <Text style={[styles.postContent, { color: theme.text }]}>{item.content}</Text>
      
      {/* Post Image (if exists) */}
      {item.image && (
        <Image 
          source={{ uri: item.image }} 
          style={styles.postImage}
          resizeMode="cover"
        />
      )}
      
      {/* Post Metrics */}
      <View style={styles.postMetrics}>
        <Text style={[styles.likeCount, { color: theme.text + '80' }]}>
          {item.likes} {item.likes === 1 ? 'like' : 'likes'}
        </Text>
        <Text style={[styles.commentCount, { color: theme.text + '80' }]}>
          {item.comments} {item.comments === 1 ? 'comment' : 'comments'}
        </Text>
      </View>
      
      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleLike(item.id)}
        >
          <Ionicons 
            name={item.isLiked ? "heart" : "heart-outline"} 
            size={22} 
            color={item.isLiked ? '#e74c3c' : theme.text + '80'} 
          />
          <Text style={[
            styles.actionText, 
            { color: item.isLiked ? '#e74c3c' : theme.text + '80' }
          ]}>
            Like
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleComment(item.id)}
        >
          <Ionicons name="chatbubble-outline" size={22} color={theme.text + '80'} />
          <Text style={[styles.actionText, { color: theme.text + '80' }]}>Comment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleShare(item.id)}
        >
          <Ionicons name="share-social-outline" size={22} color={theme.text + '80'} />
          <Text style={[styles.actionText, { color: theme.text + '80' }]}>Share</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Community" />
      
      {/* Create Post Button */}
      <TouchableOpacity 
        style={[styles.createPostButton, { backgroundColor: theme.card }]}
        onPress={() => setIsPostModalVisible(true)}
        activeOpacity={0.8}
      >
        <Image 
          source={{ uri: 'https://randomuser.me/api/portraits/lego/1.jpg' }} 
          style={styles.currentUserAvatar}
          defaultSource={require('../../../assets/images/icon.png')}
        />
        <View style={[styles.createPostInput, { backgroundColor: theme.background + '60', borderColor: theme.text + '20' }]}>
          <Text style={[styles.createPostText, { color: theme.text + '80' }]}>
            Share something with the community...
          </Text>
        </View>
        <Ionicons name="camera" size={24} color={theme.primary} style={styles.cameraIcon} />
      </TouchableOpacity>
      
      {/* Posts Feed */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.feedContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
      />
      
      {/* Create Post Modal */}
      <Modal
        visible={isPostModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsPostModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Create Post</Text>
              <TouchableOpacity onPress={() => setIsPostModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.postUserInfo}>
              <Image 
                source={{ uri: 'https://randomuser.me/api/portraits/lego/1.jpg' }} 
                style={styles.modalUserAvatar}
                defaultSource={require('../../../assets/images/icon.png')}
              />
              <Text style={[styles.modalUserName, { color: theme.text }]}>You</Text>
            </View>
            
            <TextInput
              style={[styles.postTextInput, { color: theme.text, backgroundColor: theme.background + '80' }]}
              placeholder="What's on your mind?"
              placeholderTextColor={theme.text + '60'}
              multiline
              value={newPostText}
              onChangeText={setNewPostText}
              autoFocus
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.photoButton}>
                <Ionicons name="image-outline" size={24} color={theme.primary} />
                <Text style={[styles.photoButtonText, { color: theme.text }]}>Add Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.postButton, 
                  { backgroundColor: theme.primary },
                  !newPostText.trim() && { opacity: 0.7 }
                ]}
                onPress={handleCreatePost}
                disabled={!newPostText.trim() || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.postButtonText}>Post</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      
      {/* Floating Action Button to create a new post */}
      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: theme.primary }]}
        onPress={() => setIsPostModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currentUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  createPostInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  createPostText: {
    fontSize: 14,
  },
  cameraIcon: {
    marginLeft: 12,
  },
  feedContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  postCard: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postHeaderText: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    fontSize: 15,
  },
  postTime: {
    fontSize: 12,
    marginTop: 2,
  },
  moreOptions: {
    padding: 8,
  },
  postContent: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    marginBottom: 12,
    borderRadius: 8,
  },
  postMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  likeCount: {
    fontSize: 13,
  },
  commentCount: {
    fontSize: 13,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '500',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  modalUserName: {
    fontWeight: '600',
    fontSize: 16,
  },
  postTextInput: {
    minHeight: 120,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  photoButtonText: {
    marginLeft: 6,
    fontWeight: '500',
  },
  postButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CommunityScreen;
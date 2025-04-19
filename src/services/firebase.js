// Create a mock Firebase implementation for the demo
// This avoids the need to set up a real Firebase project

const firebase = {
  firestore: {
    collection: (collectionName) => ({
      doc: (id) => ({
        update: async (data) => {
          console.log(`Updating document ${id} in collection ${collectionName} with data:`, data);
          return Promise.resolve({ id, ...data });
        },
        get: async () => {
          console.log(`Getting document ${id} from collection ${collectionName}`);
          return Promise.resolve({
            exists: true,
            data: () => ({ id, name: 'Mock Document' }),
          });
        },
        set: async (data) => {
          console.log(`Setting document ${id} in collection ${collectionName} with data:`, data);
          return Promise.resolve({ id, ...data });
        },
      }),
      add: async (data) => {
        const id = Math.random().toString(36).substring(2, 15);
        console.log(`Adding document to collection ${collectionName} with data:`, data);
        return Promise.resolve({ id, ...data });
      },
      where: () => ({
        get: async () => {
          return Promise.resolve({
            empty: false,
            docs: [
              {
                id: '1',
                data: () => ({ id: '1', name: 'Mock Document 1' }),
              },
              {
                id: '2',
                data: () => ({ id: '2', name: 'Mock Document 2' }),
              },
            ],
          });
        },
      }),
    }),
  },
  auth: {
    currentUser: {
      uid: 'mock-user-id',
      email: 'user@example.com',
      displayName: 'Mock User',
    },
    onAuthStateChanged: (callback) => {
      // Simulate a logged-in user
      callback({
        uid: 'mock-user-id',
        email: 'user@example.com',
        displayName: 'Mock User',
      });
      // Return an unsubscribe function
      return () => {};
    },
    signInWithEmailAndPassword: async () => {
      return Promise.resolve({
        user: {
          uid: 'mock-user-id',
          email: 'user@example.com',
          displayName: 'Mock User',
        },
      });
    },
    signOut: async () => Promise.resolve(),
  },
  storage: {
    ref: (path) => ({
      put: async (file) => {
        console.log(`Uploading file to ${path}`);
        return Promise.resolve({
          ref: {
            getDownloadURL: async () => 'https://via.placeholder.com/150',
          },
        });
      },
      getDownloadURL: async () => 'https://via.placeholder.com/150',
    }),
  },
  // Utility methods
  getCurrentUser: () => ({
    uid: 'mock-user-id',
    email: 'user@example.com',
    displayName: 'Mock User',
  }),
};

export default firebase; 
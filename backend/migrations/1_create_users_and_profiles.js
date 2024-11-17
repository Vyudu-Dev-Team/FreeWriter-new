module.exports = {
    async up(db) {
      await db.createCollection('users', {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["username", "email", "password"],
            properties: {
              username: {
                bsonType: "string",
                description: "must be a string and is required"
              },
              email: {
                bsonType: "string",
                pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                description: "must be a valid email address and is required"
              },
              password: {
                bsonType: "string",
                description: "must be a string and is required"
              },
              preferences: {
                bsonType: "object",
                properties: {
                  theme: { bsonType: "string" },
                  fontSize: { bsonType: "int" }
                }
              }
            }
          }
        }
      });
  
      await db.createCollection('profiles', {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["user", "bio"],
            properties: {
              user: {
                bsonType: "objectId",
                description: "must be an objectId and is required"
              },
              bio: {
                bsonType: "string",
                description: "must be a string and is required"
              },
              writingGoals: {
                bsonType: "array",
                items: {
                  bsonType: "string"
                }
              }
            }
          }
        }
      });
  
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      await db.collection('users').createIndex({ username: 1 }, { unique: true });
      await db.collection('profiles').createIndex({ user: 1 }, { unique: true });
    },
  
    async down(db) {
      await db.collection('users').drop();
      await db.collection('profiles').drop();
    }
  };
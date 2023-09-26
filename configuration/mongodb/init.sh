set -e

mongosh --authenticationDatabase "admin" -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" <<EOF

print("Started upsert the '$MONGO_PLACES_USERNAME' user.");
use admin;
if (db.getUser("$MONGO_PLACES_USERNAME") == null) {
  db.createUser({
    user: "$MONGO_PLACES_USERNAME", 
    pwd: "$MONGO_PLACES_PASSWORD", 
    roles: [
      {role: "read", db: "admin"},
      {role: "readWrite", db: "$MONGO_PLACES_DATABASE"}
    ]
  });
  
  print("'$MONGO_PLACES_USERNAME' user added.");
} else {

  print("'$MONGO_PLACES_USERNAME' user already exists.");
}
EOF
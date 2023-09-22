set -e

mongosh --authenticationDatabase "admin" -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" <<EOF

print("Started adding the '$MONGO_PLACES_USERNAME' user.");
show dbs;
use $MONGO_PLACES_DATABASE;
db.createUser({
  user: $MONGO_PLACES_USERNAME,
  pwd: $MONGO_PLACES_PASSWORD,
  roles: [{ role: "readWrite", db: "$MONGO_PLACES_DATABASE" }],
});
print("End adding the '$MONGO_PLACES_USERNAME' user.");

EOF
mongosh ChessAI --eval "db.dropDatabase()";
mongoimport --db ChessAI --collection users --file users.json --jsonArray --drop
mongoimport --db ChessAI --collection ai --file ai.json --jsonArray --drop
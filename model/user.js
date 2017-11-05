const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config/secret');
const bcrypt = require('bcrypt');

mongoose.connect(config.database, { useMongoClient : true});

mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', () => {
	console.log(`db connection error`);
});

db.once('open', () => {
	console.log(`db is connected`);
});

const UserSchema = new Schema({
	name : {
		type : String
	},
	username : {
		type : String,
		unique : true
	},
	email : {
        type : String,
        unique: true
	},
	password : {
		type : String
	},
	googleId : {
		type : String
	}
});

// hash the password before we store in db
UserSchema.pre('save', function(next) {
	// an argument for save method
	const user = this;
	// only hash if the password is updated or new
	if (!user.isModified('password')) return next();

	// generate salt
	bcrypt.genSalt(10, function(err, salt) {

		// hash password with generated salt
	bcrypt.hash(user.password, salt, function(err, hash) {
		// if there is an error stop hashing
		if (err) return next(err);

		// overrides the user entered clear password with the hashed one
			user.password = hash;
			// return callback
			next();
	});
});

})

module.exports = mongoose.model('User', UserSchema);

module.exports.comparePassword = (password, hash, callback) => {
   return bcrypt.compare(password, hash, function(err, isMatch) {
        if (err) return next(err);
		callback(null, isMatch);
  });
}
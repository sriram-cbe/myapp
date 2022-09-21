Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    name: { type: String, default: null },
    age: { type: Number, default: 10 },
    email: { type: String, default: null, require: true },
    isDeleted: { type: Boolean, default: false, required: true },
    password: { type: String, default: null }
});

const userModel = mongoose.model('user', userSchema);

function model() {
    return userModel;
}

function signup(params) {
    return new Promise((resolve, reject) => {
        model().findOne({
            email: params.email
        }).then((data) => {
            if (!data) {
                model().create(params).then((data) => {
                    resolve(data);
                }).catch((error) => {
                    reject(error);
                })
            } else {
                reject({
                    message: "The user is already registered."
                })
            }
        })
            .catch((error) => {
                reject(error);
            })
    });
}

function getAll() {
    return new Promise((resolve, reject) => {
        model().find({}).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        })
    });
}

function getByEmail(email) {
    return new Promise((resolve, reject) => {
        model().find({ email: email })
            .then((data) => { resolve(data); })
            .catch((error) => { reject(error) });
    })
}

function updateUser(params, callback) {
    console.log(params);
    var email = params.email;
    var name = params.name;
    var age = params.age;

    var request = {
        age: age,
        name: name,
    };

    model().findOneAndUpdate({ "email": email },
        { $set: request }, function (error, response) {
            callback(error, response);
        });
}


function deleteUserById(_id, callback) {
    model().deleteOne({ _id: _id }, (error, response) => {
        callback(error, response);
    })
}

function setIsDeleted(_id, callback) {
    console.log(_id);
    model().findOneAndUpdate({ _id: mongoose.Types.ObjectId(_id) }, { isDeleted: true }, (error, response) => {
        callback(error, response);
    })
}

function login(params) {
    return userModel.findOne({
        email: params.email,
        password: params.password,
        userType: params.userType
    })
}

module.exports = { model, signup, getAll, getByEmail, updateUser, deleteUserById, setIsDeleted, login }
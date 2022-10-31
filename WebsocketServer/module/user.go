package module

import (
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func UserRoute(msg []byte, conn *websocket.Conn, db_ *mgo.Database) {

	var req UserRequest
	//var user User
	error := json.Unmarshal(msg, &req)
	if error != nil {
		log.Print(error)
	}

	switch req.Action {
	case "WS_SIGN_IN":
		SignIn(&req, conn, db_)
		break
	case "WS_SIGN_UP":
		SignUp(&req, conn, db_)
		break
	case "WS_UPDATE_USER_PROFILE":
		UpdateProfile(&req, conn, db_)
		break
		//default:
		//	log.Print(req)
		//	break
	}
}

func SignUp(req *UserRequest, conn *websocket.Conn, db *mgo.Database) {

	var user, temp_user User

	db_conn := db.C("users")
	verification := false

	if req.Username == "" {
		log.Print("Empty Username")
	} else if req.Password == "" {
		log.Print("Empty Password")
	} else {
		verification = true
	}

	if verification {
		result := UserResult{Action: "WS_SIGN_UP_RESPONSE", Result: false}
		user.Username = req.Username
		user.Password = req.Password
		err := db_conn.Find(bson.M{"username": req.Username}).One(&temp_user)
		if err != nil {
			user.Type = req.UserType
			err := db_conn.Insert(user)
			if err != nil {
				//log.Print(err)
				log.Print("Sign up fail: " + req.Username)
			} else {
				result.Result = true
				log.Print("Sign up successfully: " + req.Username)
			}
		} else {
			result.ResultMessage = req.Username + " is Existing"
			log.Print("Sign up Fail: " + req.Username + " is Existing")
		}

		conn.WriteJSON(result)
	}
}

func SignIn(req *UserRequest, conn *websocket.Conn, db *mgo.Database) {

	var user User

	db_conn := db.C("users")
	verification := false

	if req.Username == "" {
		log.Print("Empty Username")
	} else if req.Password == "" {
		log.Print("Empty Password")
	} else {
		verification = true
	}

	if verification {
		//var resultUser User
		result := UserResult{Action: "WS_SIGN_IN_RESPONSE", Result: false}
		err := db_conn.Find(bson.M{"username": req.Username, "password": req.Password}).One(&user)
		if err != nil {
			log.Print("Sign in fail!")
		} else {
			result.Result = true
			result.User = user
			log.Print("Sign in successfully!")
		}

		conn.WriteJSON(result)
	}
}

func UpdateProfile(req *UserRequest, conn *websocket.Conn, db *mgo.Database) {

	var user User

	db_conn := db.C("users")
	verification := false

	//if req.Username == "" {
	//	log.Print("Empty Username")
	//} else if req.Password == "" {
	//	log.Print("Empty Password")
	//} else {
	//	verification = true
	//}

	verification = true

	if verification {
		//var resultUser User
		result := UserResult{Action: "WS_UPDATE_USER_PROFILE_RESPONSE", Result: false}

		//log.Print(req.Token);
		var err error
		log.Print(req.Password)
		log.Print(req.NewPassword)
		if req.NewPassword != "" {
			err = db_conn.Update(
				bson.M{"_id": bson.ObjectId(req.Token), "password": req.Password},
				bson.M{"$set": bson.M{"firstname": req.Firstname, "lastname": req.Lastname,
					"email": req.Email, "mobile": req.Mobile,
					"address": req.Address, "birthday": req.Birthday, "password": req.NewPassword}})
		} else {
			err = db_conn.Update(
				bson.M{"_id": bson.ObjectId(req.Token)},
				bson.M{"$set": bson.M{"firstname": req.Firstname, "lastname": req.Lastname,
					"email": req.Email, "mobile": req.Mobile,
					"address": req.Address, "birthday": req.Birthday}})
		}

		if err != nil {
			log.Print("Update User Profile fail!")
		} else {
			result.Result = true
			result.User = user
			log.Print("Update User Profile successfully!")
		}

		conn.WriteJSON(result)
	}
}

type UserRequest struct {
	Action      string        `json:"action"`
	Token       bson.ObjectId `json:"token"`
	Username    string        `json:"username"`
	Password    string        `json:"password,omitempty"`
	NewPassword string        `json:"new_password,omitempty"`
	Firstname   string        `json:"firstname"`
	Lastname    string        `json:"lastname"`
	Email       string        `json:"email"`
	Mobile      string        `json:"mobile"`
	Address     string        `json:"address"`
	Birthday    string        `json:"birthday"`
	UserType    string        `json:"user_type"`
}

type UserResult struct {
	Result        bool   `json:"result"`
	ResultMessage string `json:"result_message, omitempty"`
	Action        string `json:"action"`
	User          `json:"user"`
}

type User struct {
	Id        bson.ObjectId `json:"id,omitempty" bson:"_id,omitempty"`
	Username  string        `json:"username"`
	Password  string        `json:"password"`
	Firstname string        `json:"firstname"`
	Lastname  string        `json:"lastname"`
	Email     string        `json:"email"`
	Mobile    string        `json:"mobile"`
	Address   string        `json:"address"`
	Birthday  string        `json:"birthday"`
	Type      string        `json:"type"`
}

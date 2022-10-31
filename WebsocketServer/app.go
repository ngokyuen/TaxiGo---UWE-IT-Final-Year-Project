package main

import (
	"./module"
	"github.com/gorilla/websocket"
	"gopkg.in/mgo.v2"
	"log"
	"net/http"
	"strconv"
	//"gopkg.in/mgo.v2/bson"
)

var PORT = 3000
var UPGRADER = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var db_session *mgo.Session

func main() {
	var err error
	db_session, err = mgo.Dial("localhost")
	if err != nil {
		log.Fatal(err)
	}

	defer db_session.Close()

	log.Println("Server  Start")
	http.HandleFunc("/", wsHandleFunc)
	log.Fatal(http.ListenAndServe(":"+strconv.Itoa(PORT), nil))
}

func wsHandleFunc(w http.ResponseWriter, r *http.Request) {
	ws, err := UPGRADER.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	defer ws.Close()

	for {
		//msgType, msg, err := ws.ReadMessage()
		_, msg, err := ws.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		module.UserRoute(msg, ws, db_session.DB("taxi"))
		module.OrderRoute(msg, ws, db_session.DB("taxi"))

		//log.Print(msg)
		//log.Println("wrtie")
		//if string(msg) == "ping" {
		//	log.Println("ping")
		//	err = ws.WriteMessage(msgType, msg)
		//	if err != nil {
		//		log.Println(err)
		//		return
		//	}
		//}

	}
}

package module

import (
	"encoding/json"
	"log"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func OrderRoute(msg []byte, conn *websocket.Conn, db_ *mgo.Database) {

	//t := time.Now()
	//log.Print(t)

	//log.Print(msg)
	var req OrderRequest
	//var user User
	error := json.Unmarshal(msg, &req)
	if error != nil {
		log.Print(error)
	}

	switch req.Action {
	case "WS_GET_AVAILABLE_ORDERS":
		GetAvailableOrders(&req, conn, db_)
		break
	case "WS_SUBMIT_EDIT_NORMAL_ORDER":
		SubmitEditNormalOrder(&req, conn, db_)
		break
	case "WS_SUBMIT_NORMAL_ORDER":
		SubmitNormalOrder(&req, conn, db_)
		break
	case "WS_GET_USER_ORDERS":
		GetUserOrders(&req, conn, db_)
		break
	case "WS_GET_SHARE_ORDERS":
		GetShareOrders(&req, conn, db_)
		break
	case "WS_CANCEL_ORDER":
		CancelOrder(&req, conn, db_)
		break
	case "WS_CHANGE_TRANSITION_STATUS":
		ChangeTransitionStatus(&req, conn, db_)
		break
	case "WS_CHANGE_ARRIVAL_STATUS":
		ChangeArrivalStatus(&req, conn, db_)
		break
	case "WS_JOIN_ORDER":
		JoinOrder(&req, conn, db_)
		break
	case "WS_LEAVE_JOIN_ORDER":
		LeaveJoinOrder(&req, conn, db_)
		break
	case "WS_COMPLETE_ORDER":
		CompleteOrder(&req, conn, db_)
		break
	case "WS_ACCEPT_ORDER":
		AcceptOrder(&req, conn, db_)
		break
	case "WS_GET_ACCEPT_HISTORY_ORDERS":
		GetAcceptHistoryOrders(&req, conn, db_)
		break
	case "WS_SET_PAYMENT_METHOD":
		SetPaymentMethod(&req, conn, db_)
		break
	}
}

func relatedJoinedUser(orders []Order, db *mgo.Database) {

	db_conn_users := db.C("users")
	db_conn_join_users := db.C("join_users")

	for index, value := range orders {

		var join_users []JoinUser
		err := db_conn_join_users.Find(bson.M{"order": value.Id, "isPrevious": false}).All(&join_users)

		if err != nil {
			log.Print("Get Related Joined Orders Fail")
		} else {

			orders[index].JoinUsers_ = join_users

			for index2, value2 := range join_users {

				var user User
				err := db_conn_users.Find(bson.M{"_id": value2.User}).One(&user)
				if err != nil {
					log.Print("Get Share Orders fail!")
				} else {
					orders[index].JoinUsers_[index2].User_ = user
				}
			}
		}

		// orders[index].JoinUsers_ = join_users

	}
}

func relatedDriver(orders []Order, db *mgo.Database) {

	db_conn := db.C("users")

	for index, value := range orders {

		var user User
		err := db_conn.Find(bson.M{"_id": value.Driver}).One(&user)
		if err != nil {
			//log.Print("Get Share Orders fail!")
		} else {
			orders[index].Driver_ = user
		}
	}
}

func SetPaymentMethod(req *OrderRequest, conn *websocket.Conn, db *mgo.Database) {

	var order Order
	db_conn_orders := db.C("orders")
	db_conn_join_users := db.C("join_users")
	verification := true

	if verification {
		result := OrderResult{Action: "WS_SET_PAYMENT_METHOD_RESPONSE", Result: false}
		err := db_conn_orders.Find(bson.M{"_id": req.OrderID}).One(&order)
		if err != nil {
			log.Print("Set Payment Fail: No order found by order_id: " + req.OrderID)
		} else {

			if !order.IsShare || order.User == req.Token {
				//for normal order or owner
				if order.User == req.Token {
					query := bson.M{
						"_id": bson.ObjectId(req.OrderID),
					}

					update := bson.M{
						"$set": bson.M{
							"paymentMethod": req.PaymentMethod,
							"paymentStatus": PENDING,
						},
					}

					err = db_conn_orders.Update(query, update)
					if err != nil {
						log.Print("Set Payment Method fail!")
					} else {
						result.Result = true
						log.Print("Set Payment Method successfully!")
					}
				} else {
					log.Print("Set Payment Fail: user is not owner: " + req.Token)
				}

			} else {
				//for share order
				err := db_conn_join_users.Update(
					bson.M{"order": req.OrderID, "user": req.Token, "status": JOIN, "isPrevious": false},
					bson.M{"$set": bson.M{"paymentMethod": req.PaymentMethod, "paymentStatus": PENDING}})

				if err != nil {
					log.Print("Set Payment Method fail!")
				} else {
					result.Result = true
					log.Print("Set Payment Method successfully!")
				}
			}

		}

		conn.WriteJSON(result)
	}
}

func JoinOrder(req *OrderRequest, conn *websocket.Conn, db *mgo.Database) {

	var order Order
	//var user User

	db_conn_orders := db.C("orders")
	db_conn_join_users := db.C("join_users")
	//db_conn_users := db.C("users")
	//verification := false
	verification := true

	//if req.Username == "" {
	//	log.Print("Empty Username")
	//} else if req.Password == "" {
	//	log.Print("Empty Password")
	//} else {
	//	verification = true
	//}

	if verification {

		result := OrderResult{Action: "WS_JOIN_ORDER_RESPONSE", Result: false}

		err := db_conn_orders.Find(bson.M{"_id": req.OrderID}).One(&order)
		if err != nil {
			log.Print("Join Order fail:1")
		} else {
			//result.Result = true
			//result.User = user
			//log.Print("Sign in successfully!")
			var join_users []JoinUser
			var is_join = false
			err := db_conn_join_users.Find(bson.M{"order": order.Id, "isPrevious": false}).All(&join_users)

			if err != nil {
				log.Print("Join Order Fail:2")
			} else {

				for _, value := range join_users {
					if value.Status == JOIN && value.User == req.Token && value.IsPrevious != true {
						is_join = true
					}
				}

				// for _, value := range order.JoinUsers {
				// 	if value.Status == JOIN && value.User == req.Token && value.IsPrevious != true {
				// 		is_join = true
				// 	}
				// }

				if is_join {
					log.Print("Join Order Fail: Joined Before!")
				} else {

					temp_joinUser := new(JoinUser)
					temp_joinUser.Id = bson.NewObjectId()
					temp_joinUser.Order = order.Id
					temp_joinUser.User = req.Token
					temp_joinUser.Status = JOIN
					temp_joinUser.PaymentStatus = PENDING
					temp_joinUser.IsPrevious = false
					temp_joinUser.JoinDateTime = time.Now()
					err := db_conn_join_users.Insert(temp_joinUser)

					if err != nil {
						log.Print(err)
						log.Print("Create Join User fail!")
					} else {

						query := bson.M{
							//"user": bson.ObjectId(req.Token),
							"_id": order.Id,
						}

						update := bson.M{
							"$set": bson.M{
								"joinUsers": append(order.JoinUsers, temp_joinUser.Id),
							},
						}

						err = db_conn_orders.Update(query, update)
						if err != nil {
							log.Print("Join Order fail!")
						} else {
							result.Result = true
							log.Print("Join Order successfully!")
						}

					}

				}

			}

		}

		conn.WriteJSON(result)
	}
}

func LeaveJoinOrder(req *OrderRequest, conn *websocket.Conn, db *mgo.Database) {

	var order Order
	//var user User

	db_conn_orders := db.C("orders")
	db_conn_join_users := db.C("join_users")
	//db_conn_users := db.C("users")
	//verification := false
	verification := true

	//if req.Username == "" {
	//	log.Print("Empty Username")
	//} else if req.Password == "" {
	//	log.Print("Empty Password")
	//} else {
	//	verification = true
	//}

	if verification {

		result := OrderResult{Action: "WS_LEAVE_JOIN_ORDER_RESPONSE", Result: false}

		err := db_conn_orders.Find(bson.M{"_id": req.OrderID}).One(&order)
		if err != nil {
			log.Print("Leave Order fail!")
		} else {
			//result.Result = true
			//result.User = user
			//log.Print("Sign in successfully!")
			var join_users []JoinUser
			var is_join = false
			err := db_conn_join_users.Find(bson.M{"order": order.Id, "isPrevious": false}).All(&join_users)

			if err != nil {

				log.Print("Leave Order fail!")
			} else {

				for _, value := range join_users {
					if value.Status == JOIN && value.User == req.Token && value.IsPrevious != true {
						is_join = true
					}
				}

				if !is_join {
					log.Print("Not Join Before")
				} else {

					for _, value := range join_users {
						if value.User == req.Token {
							// join_users[index].IsPrevious = true
							_ = db_conn_join_users.Update(bson.M{"_id": value.Id}, bson.M{"$set": bson.M{"isPrevious": true}})
						}
					}

					temp_joinUser := new(JoinUser)
					temp_joinUser.Id = bson.NewObjectId()
					temp_joinUser.Order = order.Id
					temp_joinUser.User = req.Token
					temp_joinUser.Status = LEAVE
					temp_joinUser.IsPrevious = false
					temp_joinUser.JoinDateTime = time.Now()
					err := db_conn_join_users.Insert(temp_joinUser)

					query := bson.M{
						//"user": bson.ObjectId(req.Token),
						"_id": order.Id,
					}

					update := bson.M{
						"$set": bson.M{
							"joinUsers": append(order.JoinUsers, temp_joinUser.Id),
						},
					}

					err = db_conn_orders.Update(query, update)
					if err != nil {
						log.Print("Leave Order fail!")
					} else {
						result.Result = true
						log.Print("Leave Order successfully!")
					}

				}
			}

		}

		conn.WriteJSON(result)
	}

}

func CancelOrder(req *OrderRequest, conn *websocket.Conn, db *mgo.Database) {

	db_conn := db.C("orders")
	verification := true

	if verification {
		result := OrderResult{Action: "WS_CANCEL_ORDER_RESPONSE", Result: false}

		query := bson.M{
			"user": bson.ObjectId(req.Token),
			"_id":  bson.ObjectId(req.OrderID),
		}

		update := bson.M{
			"$set": bson.M{
				"status": CANCELLED,
			},
		}

		err := db_conn.Update(query, update)
		if err != nil {
			log.Print("Cancel Order fail!")
		} else {
			result.Result = true
			log.Print("Cancel Order successfully!")
		}

		conn.WriteJSON(result)
	}

}

func ChangeTransitionStatus(req *OrderRequest, conn *websocket.Conn, db *mgo.Database) {

	db_conn := db.C("orders")
	verification := true

	if verification {
		result := OrderResult{Action: "WS_CHANGE_TRANSITION_STATUS_RESPONSE", Result: false}

		query := bson.M{
			"driver": bson.ObjectId(req.Token),
			"_id":    bson.ObjectId(req.OrderID),
		}

		update := bson.M{
			"$set": bson.M{
				"status": TRANSITING,
			},
		}

		err := db_conn.Update(query, update)
		if err != nil {
			log.Print("Change Transition Status fail!")
		} else {
			result.Result = true
			log.Print("Change Transition Status successfully!")
		}

		conn.WriteJSON(result)
	}

}

func ChangeArrivalStatus(req *OrderRequest, conn *websocket.Conn, db *mgo.Database) {

	db_conn := db.C("orders")
	verification := true

	if verification {
		result := OrderResult{Action: "WS_CHANGE_ARRIVAL_STATUS_RESPONSE", Result: false}

		query := bson.M{
			"driver": bson.ObjectId(req.Token),
			"_id":    bson.ObjectId(req.OrderID),
		}

		update := bson.M{
			"$set": bson.M{
				"status": ARRIVAL,
				"price":  req.Price,
			},
		}

		err := db_conn.Update(query, update)
		if err != nil {
			log.Print("Change Arrival Status fail!")
		} else {
			result.Result = true
			log.Print("Change Arrival Status successfully!")
		}

		conn.WriteJSON(result)
	}

}

func AcceptOrder(req *OrderRequest, conn *websocket.Conn, db *mgo.Database) {

	db_conn := db.C("orders")
	verification := true

	if verification {
		//log.Print(req.UserID);
		result := OrderResult{Action: "WS_ACCEPT_ORDER_RESPONSE", Result: false}

		query := bson.M{
			"_id": bson.ObjectId(req.OrderID),
		}

		update := bson.M{
			"$set": bson.M{
				"status": PICKED,
				"driver": bson.ObjectId(req.UserID),
			},
		}

		err := db_conn.Update(query, update)
		if err != nil {
			log.Print("Accept Order fail!")
		} else {
			result.Result = true
			log.Print("Accept Order successfully!")
		}

		conn.WriteJSON(result)
	}

}

func CompleteOrder(req *OrderRequest, conn *websocket.Conn, db *mgo.Database) {

	db_conn := db.C("orders")
	verification := true

	if verification {
		//log.Print(req.UserID);
		result := OrderResult{Action: "WS_COMPLETE_ORDER_RESPONSE", Result: false}

		query := bson.M{
			"_id": bson.ObjectId(req.OrderID),
		}

		update := bson.M{
			"$set": bson.M{
				"status": COMPLETED,
			},
		}

		err := db_conn.Update(query, update)
		if err != nil {
			log.Print("Complete Order fail!")
		} else {
			result.Result = true
			log.Print("Complete Order successfully!")
		}

		conn.WriteJSON(result)
	}

}

func GetAvailableOrders(req *OrderRequest, conn *websocket.Conn, db *mgo.Database) {

	var orders []Order

	db_conn := db.C("orders")
	//verification := false
	verification := true

	if verification {
		result := OrderResult{Action: "WS_GET_AVAILABLE_ORDERS_RESPONSE", Result: false}
		err := db_conn.Find(bson.M{"status": PENDING}).All(&orders)
		if err != nil {
			log.Print("Get Available Orders fail!")
		} else {
			//log.Print(orders)
			result.Result = true

			relatedJoinedUser(orders, db)
			relatedDriver(orders, db)

			result.Orders = orders

			//log.Print(orders)
			log.Print("Get Available Orders successfully!")
		}

		conn.WriteJSON(result)
	}

}

func GetAcceptHistoryOrders(req *OrderRequest, conn *websocket.Conn, db *mgo.Database) {

	var orders []Order

	db_conn := db.C("orders")
	//verification := false
	verification := true

	if verification {
		result := OrderResult{Action: "WS_GET_ACCEPT_HISTORY_ORDERS_RESPONSE", Result: false}
		err := db_conn.Find(bson.M{"driver": bson.ObjectId(req.UserID)}).All(&orders)
		if err != nil {
			log.Print("Get Accept History Orders fail!")
		} else {
			//log.Print(orders)
			result.Result = true

			relatedJoinedUser(orders, db)
			relatedDriver(orders, db)

			result.Orders = orders
			log.Print("Get Accept History Orders successfully!")
		}

		conn.WriteJSON(result)
	}

}

func GetUserOrders(req *OrderRequest, conn *websocket.Conn, db *mgo.Database) {

	var orders []Order

	db_conn_orders := db.C("orders")
	db_conn_join_users := db.C("join_users")
	//verification := false
	verification := true

	//if req.Username == "" {
	//	log.Print("Empty Username")
	//} else if req.Password == "" {
	//	log.Print("Empty Password")
	//} else {
	//	verification = true
	//}

	if verification {
		result := OrderResult{Action: "WS_GET_USER_ORDERS_RESPONSE", Result: false}
		err := db_conn_orders.Find(bson.M{"user": req.Token}).All(&orders)
		if err != nil {
			log.Print("Get Orders fail!")
		} else {
			//log.Print(orders)
			result.Result = true

			//add joined order
			var joinUsers []JoinUser
			err := db_conn_join_users.Find(bson.M{"user": req.Token, "isPrevious": false, "status": JOIN}).All(&joinUsers)
			if err != nil {
				log.Print("Get Orders fail!")
			} else {

				for _, value := range joinUsers {
					var order Order
					err := db_conn_orders.Find(bson.M{"_id": value.Order}).One(&order)
					if err != nil {
						log.Print("Get Orders fail!")
					} else {
						orders = append(orders, order)
					}

				}

				relatedJoinedUser(orders, db)
				relatedDriver(orders, db)

				result.Orders = orders
				log.Print("Get Orders successfully!")
			}

		}

		conn.WriteJSON(result)
	}

}

func GetShareOrders(req *OrderRequest, conn *websocket.Conn, db *mgo.Database) {

	var orders []Order

	db_conn := db.C("orders")
	//verification := false
	verification := true

	//if req.Username == "" {
	//	log.Print("Empty Username")
	//} else if req.Password == "" {
	//	log.Print("Empty Password")
	//} else {
	//	verification = true
	//}

	if verification {
		result := OrderResult{Action: "WS_GET_SHARE_ORDERS_RESPONSE", Result: false}
		//err := db_conn.Find(bson.M{"user": bson.ObjectId(req.Token), "isshare":true}).All(&orders)
		err := db_conn.Find(
			bson.M{"$and": []bson.M{
				bson.M{"isShare": true},
				bson.M{"$or": []bson.M{
					bson.M{"status": PENDING},
					bson.M{"status": PICKED},
				},
				},
			},
			}).All(&orders)
		if err != nil {
			log.Print("Get Share Orders fail!")
		} else {
			//log.Print(orders)
			result.Result = true

			relatedJoinedUser(orders, db)
			relatedDriver(orders, db)

			result.Orders = orders

			log.Print("Get Share Orders successfully!")
		}

		conn.WriteJSON(result)
	}

}

func SubmitNormalOrder(req *OrderRequest, conn *websocket.Conn, db *mgo.Database) {

	var order Order

	db_conn := db.C("orders")
	//verification := false
	verification := true

	//if req.Username == "" {
	//	log.Print("Empty Username")
	//} else if req.Password == "" {
	//	log.Print("Empty Password")
	//} else {
	//	verification = true
	//}

	if verification {
		result := OrderResult{Action: "WS_SUBMIT_NORMAL_ORDER_RESPONSE", Result: false}
		order.Departure = req.Departure
		order.Destination = req.Destination
		order.StartDate = req.StartDate
		order.StartTime = req.StartTime

		year, _ := strconv.Atoi(req.StartDate[0:4])
		month, _ := strconv.Atoi(req.StartDate[5:7])
		day, _ := strconv.Atoi(req.StartDate[8:10])
		//log.Print(year + "" + month + "" + day)

		hour, _ := strconv.Atoi(req.StartTime[0:2])
		min, _ := strconv.Atoi(req.StartTime[3:5])

		loc, _ := time.LoadLocation("Asia/Hong_Kong")

		order.StartDateTime = time.Date(year, time.Month(month), day, hour, min, 00, 000, loc)

		order.ContactPerson = req.ContactPerson
		order.ContactContactNo = req.ContactContactNo
		order.IsFiveSeat = req.IsFiveSeat
		order.IsShare = req.IsShare
		order.ShareSeat = req.ShareSeat
		order.Status = PENDING

		//missing verification for token
		order.User = req.Token

		err := db_conn.Insert(order)
		if err != nil {
			log.Print(err)
			log.Print("Create Order fail!")
		} else {
			result.Result = true
			log.Print("Create Order successfully!")
		}

		conn.WriteJSON(result)
	}
}

func SubmitEditNormalOrder(req *OrderRequest, conn *websocket.Conn, db *mgo.Database) {

	//var order Order

	db_conn := db.C("orders")
	//verification := false
	verification := true

	//if req.Username == "" {
	//	log.Print("Empty Username")
	//} else if req.Password == "" {
	//	log.Print("Empty Password")
	//} else {
	//	verification = true
	//}

	if verification {
		result := OrderResult{Action: "WS_SUBMIT_EDIT_NORMAL_ORDER_RESPONSE", Result: false}

		//err := db_conn.Find(bson.M{"_id": bson.ObjectId(req.Order.Id)}).One(&order)

		departure := req.Order.Departure
		destination := req.Order.Destination
		startDate := req.Order.StartDate
		startTime := req.Order.StartTime

		year, _ := strconv.Atoi(req.Order.StartDate[0:4])
		month, _ := strconv.Atoi(req.Order.StartDate[5:7])
		day, _ := strconv.Atoi(req.Order.StartDate[8:10])
		//log.Print(year + "" + month + "" + day)

		hour, _ := strconv.Atoi(req.Order.StartTime[0:2])
		min, _ := strconv.Atoi(req.Order.StartTime[3:5])

		loc, _ := time.LoadLocation("Asia/Hong_Kong")

		startDateTime := time.Date(year, time.Month(month), day, hour, min, 00, 000, loc)

		contactPerson := req.Order.ContactPerson
		contactContactNo := req.Order.ContactContactNo
		isFiveSeat := req.Order.IsFiveSeat
		isShare := req.Order.IsShare
		shareSeat := req.Order.ShareSeat
		//order.Status = PENDING

		//missing verification for token
		//user := req.Token

		//log.Print(req);
		//log.Print(contactPerson);

		err := db_conn.Update(
			bson.M{"_id": bson.ObjectId(req.Order.Id), "status": PENDING},
			bson.M{
				"$set": bson.M{"departure": departure, "destination": destination,
					"contactPerson": contactPerson, "contactContactNo": contactContactNo, "isFiveSeat": isFiveSeat,
					"isShare": isShare, "shareSeat": shareSeat, "startDate": startDate, "startTime": startTime, "startDateTime": startDateTime,
				}})
		if err != nil {
			log.Print(err)
			log.Print("Edit Order fail!")
		} else {
			result.Result = true
			log.Print("Edit Order successfully!")
		}

		conn.WriteJSON(result)
	}
}

type OrderRequest struct {
	Action        string `json:"action"`
	Order         `json:"order"`
	Token         bson.ObjectId `json:"token"`
	OrderID       bson.ObjectId `json:"order_id,omitempty" bson:"order_id,omitempty"`
	UserID        bson.ObjectId `json:"user_id,omitempty" bson:"user_id,omitempty"`
	Price         string        `json:"price"`
	PaymentMethod string        `json:"payment_method"`
}

type OrderResult struct {
	Result        bool    `json:"result"`
	ResultMessage string  `json:"result_message, omitempty"`
	Action        string  `json:"action"`
	Orders        []Order `json:"orders"`
	Order         Order   `json:"order"`
}

type Order struct {
	Id               bson.ObjectId `json:"id,omitempty" bson:"_id,omitempty"`
	Departure        string        `json:"departure"  bson:"departure"`
	Destination      string        `json:"destination" bson:"destination"`
	StartDate        string        `json:"startDate" bson:"startDate"`
	StartTime        string        `json:"startTime" bson:"startTime"`
	StartDateTime    time.Time     `json:"startDateTime" bson:"startDateTime"`
	ContactPerson    string        `json:"contactPerson" bson:"contactPerson"`
	ContactContactNo string        `json:"contactContactNo" bson:"contactContactNo"`
	IsFiveSeat       bool          `json:"isFiveSeat,omitempty" bson:"isFiveSeat,omitempty"`
	IsShare          bool          `json:"isShare" bson:"isShare"`
	ShareSeat        string        `json:"shareSeat,omitempty" bson:"shareSeat,omitempty"`
	Price            string        `json:"price,omitempty" bson:"price,omitempty"`
	PaymentMethod    string        `json:"paymentMethod,omitempty" bson:"paymentMethod,omitempty"`
	PaymentStatus    string        `json:"paymentStatus,omitempty" bson:"paymentStatus,omitempty"`
	// JoinUsers        []bson.ObjectId `json:"joinUsers" bson:"joinUsers"`
	JoinUsers  []bson.ObjectId `json:"joinUsers,omitempty" bson:"joinUsers,omitempty"`
	JoinUsers_ []JoinUser      `json:"joinUsers_,omitempty" bson:"joinUsers_,omitempty"`
	Status     string          `json:"status" bson:"status"`
	User       bson.ObjectId   `json:"user,omitempty" bson:"user,omitempty"`
	User_      User            `json:"user_,omitempty" bson:"user_,omitempty"`
	Driver     bson.ObjectId   `json:"driver,omitempty" bson:"driver,omitempty"`
	Driver_    User            `json:"driver_,omitempty" bson:"driver_,omitempty"`
}

type JoinUser struct {
	Id            bson.ObjectId `json:"id,omitempty" bson:"_id,omitempty"`
	Order         bson.ObjectId `json:"order" bson:"order"`
	User          bson.ObjectId `json:"user" bson:"user"`
	Status        string        `json:"status" bson:"status"`
	IsPrevious    bool          `json:"isPrevious" bson:"isPrevious"`
	JoinDateTime  time.Time     `json:"joinDateTime" bson:"joinDateTime"`
	User_         User          `json:"user_" bson:"user_"`
	PaymentMethod string        `json:"paymentMethod,omitempty" bson:"paymentMethod,omitempty"`
	PaymentStatus string        `json:"paymentStatus,omitempty" bson:"paymentStatus,omitempty"`
}

//order status
const (
	PENDING    string = "PENDING"
	PICKED     string = "PICKED"
	TRANSITING string = "TRANSITING"
	ARRIVAL    string = "ARRIVAL"
	COMPLETED  string = "COMPLETED"
	CANCELLED  string = "CANCELLED"
)

//join order status
const (
	JOIN   string = "JOIN"
	REJECT string = "REJECT"
	LEAVE  string = "LEAVE"
	NOSHOW string = "NOSHOW"
)

//payment method
const (
	CASH   string = "CASH"
	PAYPAL string = "PAYPAL"
	ALIPAY string = "ALIPAY"
)

//payment status
const (
	PAID string = "PAID"
	//PENDING string = "PENDING"
)

import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [filterusers, setFilterusers] = useState();
  const [ismodelopen, setIsmodelopen] = useState(false);
  const [userdata, setuserdata] = useState({ name: "", age: "", city: "" });

  const getallusers = async () => {
    await axios.get("https://nodejs123.netlify.app/users").then((res) => {
      setUsers(res.data);
      setFilterusers(res.data);
    });
  };

  useEffect(() => {
    getallusers();
  }, []);

  // search data

  const handlesearchchange = (e) => {
    const searchtext = e.target.value.toLowerCase();
    const filtered = users.filter((user) => {
      return (
        user.name.toLowerCase().includes(searchtext) ||
        user.city.toLowerCase().includes(searchtext)
      );
    });
    setFilterusers(filtered);
  };

  //delete function

  const handledelete = async (id) => {
    const isconformed = window.confirm("Are you sure delete this data");

    if (isconformed) {
      await axios.delete(`https://nodejs123.netlify.app/users/${id}`).then((res) => {
        setUsers(res.data);
        setFilterusers(res.data);
      });
    }
  };
  //add record function

  const handleaddrecord = () => {
    setuserdata({ name: "", age: "", city: "" });
    setIsmodelopen(true);
  };
  // close model
  const closemodel = () => {
    setIsmodelopen(false);
    getallusers();
  };
  //handle data
  const handledata = (e) => {
    setuserdata({ ...userdata, [e.target.name]: e.target.value });
  };
  const handlesubmit = async (e) => {
    e.preventDefault();

    if (userdata.id) {
      await axios
        .patch(`https://nodejs123.netlify.app/users/${userdata.id}`, userdata)
        .then((res) => {
          console.log(res);
        });
    } else {
      await axios.post("https://nodejs123.netlify.app/users", userdata).then((res) => {
        console.log(res);
      });
    }

    closemodel();
    setuserdata({ name: "", age: "", city: "" });
  };

  // updateRecord
  const handleupdateRecord = (users) => {
    setuserdata(users);
    setIsmodelopen(true);
  };

  return (
    <>
      <div className="Contaniner">
        <h2>CRUD</h2>
        <div className="input-search">
          <input
            type="search"
            placeholder="search text here"
            onChange={handlesearchchange}
          />
          <button className="btn green" onClick={handleaddrecord}>
            Add data
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filterusers &&
              filterusers.map((users, id) => {
                return (
                  <tr key={users.id}>
                    <td>{id + 1}</td>
                    <td>{users.name}</td>
                    <td>{users.age}</td>
                    <td>{users.city}</td>
                    <td>
                      <button
                        className="btn green"
                        onClick={() => handleupdateRecord(users)}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn red "
                        onClick={() => handledelete(users.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {ismodelopen && (
          <div>
            <div className="model">
              <div className="content">
                <span className="close" onClick={closemodel}>
                  &times;
                </span>
                <h1>User Record</h1>
                <div className="input-group">
                  <label htmlFor="name">FullName</label>
                  <input
                    type="text"
                    placeholder="Enter Your Name"
                    value={userdata.name}
                    onChange={handledata}
                    name="name"
                    id="name"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    placeholder="Enter Your Name"
                    value={userdata.age}
                    onChange={handledata}
                    name="age"
                    id="age"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    placeholder="Enter Your Name"
                    value={userdata.city}
                    onChange={handledata}
                    name="city"
                    id="city"
                  />
                </div>
                <button className="btn green" onClick={handlesubmit}>
                  {" "}
                  AddUser
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;

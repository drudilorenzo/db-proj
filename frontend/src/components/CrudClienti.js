import React, { useState, useEffect } from "react"
import Table from "react-bootstrap/Table"
import NewUtente from "./NewUtente"

import { httpHelper } from "../helpers/httpHelper"

const CrudClienti = () => {
	const [users, setUsers] = useState(null)

	const url = "http://localhost:8080/api/cliente"
	const api = httpHelper()

	useEffect(() => {
		getUsers()
	}, [])

	const postUser = user => {
    console.log(user);
		api
			.post(`${url}/register`, { body: user })
			.then(res => getUsers())
			.catch(err => console.log(err))
	}

	const getUsers = () => {
		api
			.get(`${url}`)
			.then(res => {
        console.log(res)
				setUsers(res)
			})
			.catch(err => console.log(err))
	}

	if (!users) return null

	return (
		<>
    <h3>Nuovo Cliente</h3>
    <NewUtente 
      postUser={postUser}
    />
    <div className='all-users'>
      <h3>Clienti</h3>
      <Table striped>
        <thead>
          <tr>
            {users && Object.keys(users[0]).map(k => <th key={k}>{ k }</th>)}
          </tr>
        </thead>
        <tbody>
          { users &&
            users.map(u => 
              <tr key={u.IdCliente}>
                <td> { u.IdCliente } </td>
                <td> { u.Nome } </td>
                <td> { u.Cognome } </td>
                <td> { u.Email } </td>
                <td> { (new Date(u.DataNascita)).toLocaleDateString("it-IT") } </td>
              </tr>
            )
          }
        </tbody>
      </Table>
    </div>
		</>
	)
}

export default CrudClienti;
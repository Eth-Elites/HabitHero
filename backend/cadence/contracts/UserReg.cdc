access(all) contract UserReg {

    access(all) struct User {
        access(all) let name: String
        access(all) let email: String
        access(all) let createdAt: UFix64

        init(name: String, email: String) {
            self.name = name
            self.email = email
            self.createdAt = getCurrentBlock().timestamp
        }
    }

    access(contract) var users: {Address: User}

    access(all) event UserRegistered(address: Address, name: String, email: String)

    init() {
        self.users = {}
    }

    access(all) fun registerUser(addr: Address, name: String, email: String) {
        if self.users[addr] != nil {
            panic("User already registered!")
        }

        let newUser = User(name: name, email: email)
        self.users[addr] = newUser

        emit UserRegistered(address: addr, name: name, email: email)
    }

    access(all) fun getUser(addr: Address): User? {
        return self.users[addr]
    }
}

import UserReg from 0x073e2f294371acd0

transaction(name: String, email: String, gender: String) {
    prepare(signer: &Account) {
        // signer.address is the Address value
        UserReg.registerUser(addr: signer.address, name: name, email: email, gender: String)
    }
}

import { ValidationError } from "../errors/app-error";

export class User {

    private constructor(
        readonly id: number | null,
        private username: string,
        private email: string,
        private phonenumber: string,
        private password: string
    ) {}

    static create(id: number | null, username: string, email: string, phonenumber: string, password: string): User {

        if (typeof username !== 'string' || username.length < 5) {
            throw new ValidationError("Username is too short");
        }

        if (typeof email !== 'string' || !email.includes("@")) {
            throw new ValidationError("Invalid email");
        }

        if (typeof phonenumber !== 'string' || phonenumber.length < 11) {
            throw new ValidationError("Phone number is too short");
        }

        if (typeof password !== 'string' || password.length < 8) {
            throw new ValidationError("Password too short");
        }

        return new User(id, username, email, phonenumber, password);
    }

    getUsername(): string {
        return this.username;
    }

    getEmail(): string {
        return this.email;
    }

    getPhoneNumber(): string {
        return this.phonenumber;
    }

    getPassword(): string {
        return this.password;
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            phonenumber: this.phonenumber
        };
    }
}

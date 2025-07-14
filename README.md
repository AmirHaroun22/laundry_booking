# Laundry Booking System

A web app built with Django and React that simplifies laundry machine reservations for student dorm residents. Users can view available machines and book time slots efficiently. The system ensures fair access to shared laundry facilities.

---

## Motivation?

Booking laundry machines in a 200-student dorm is challenging. Taking the elevator from the 17th floor to the Keller (basement laundry room) just to check availability—if the elevator is even working—only to find the machines already in use is frustrating.

This system was designed to make shared laundry management much easier by:

* Displaying real-time machine availability
* Enabling online booking, cancellation, or rescheduling without needing to go down to the Keller

---

## Quick Start

Frontend:

* [https://asasiya.com](https://asasiya.com)

API:

* [https://api.asasiya.com/api/bookings/](https://api.asasiya.com/api/bookings/)

LDAP server:

* [https://ldap.asasiya.com/](https://ldap.asasiya.com/)

**Test Credentials**

* Frontend/Backend:

  * Username: `teststudent`
  * Password: `teststudentpassword`

* LDAP Admin:

  * Username: `cn=admin,dc=example,dc=com`
  * Password: `admin`

---

## Usage

1. **Log in** using Test Credentials.
2. **View** the list of available time slots for laundry machines.
3. **Book** a slot by entering 4-digit room number (format and validation enforced):

   * Must be 4 digits.
   * First 2 digits = floor (01–17).
   * For floors 1–4: room numbers 01–16.
   * For floors 5–17: room numbers 01–10.
   * For example 0116 or 0510

4. **Update** or **cancel**  bookings as needed.

---

## Contribution

Contributions are welcome!

✅ Fork the repository
✅ Create a feature branch
✅ Commit your changes
✅ Submit a pull request

For major changes or proposals, please open an issue first to discuss your ideas.

---

Licensed under the MIT License.
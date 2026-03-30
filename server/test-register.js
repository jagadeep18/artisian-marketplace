const data = {
  email: "artisan_test_7@example.com",
  password: "password123",
  role: "artisan",
  shopName: "Test Shop",
  ownerName: "Test Owner",
  mobileNumber: "9876543210",
  shopAddress: "Test Address",
  pinCode: "500001",
  revenue: 1000
};

fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
.then(res => res.json().then(data => ({status: res.status, data})))
.then(result => console.log(JSON.stringify(result, null, 2)))
.catch(err => console.error(err));

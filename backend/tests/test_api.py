def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_user_registration(client):
    payload = {
        "email": "newbie@example.com",
        "password": "secretpassword",
        "full_name": "Newbie Dev"
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "newbie@example.com"
    assert "id" in data["user"]


def test_user_duplicate_email_fails(client):
    payload = {
        "email": "duplicate@example.com",
        "password": "password123",
        "full_name": "Dup User"
    }
    r1 = client.post("/api/auth/register", json=payload)
    assert r1.status_code == 201

    r2 = client.post("/api/auth/register", json=payload)
    assert r2.status_code == 400
    assert "already exists" in r2.json()["detail"]


def test_user_login(client):
    register_payload = {
        "email": "loginme@example.com",
        "password": "mypassword",
        "full_name": "Login Me"
    }
    client.post("/api/auth/register", json=register_payload)

    login_res = client.post("/api/auth/login", json={
        "email": "loginme@example.com",
        "password": "mypassword"
    })
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()


def test_create_expense_unauthorized(client):
    expense_data = {
        "title": "Coffee",
        "amount": 4.50,
        "category": "Food"
    }
    response = client.post("/api/expenses", json=expense_data)
    assert response.status_code == 401


def test_create_and_get_expense(client, auth_headers):
    expense_data = {
        "title": "Groceries",
        "amount": 65.50,
        "category": "Food",
        "notes": "Weekly supermarket run"
    }
    post_res = client.post("/api/expenses", json=expense_data, headers=auth_headers)
    assert post_res.status_code == 201
    created = post_res.json()
    assert created["title"] == "Groceries"
    assert created["amount"] == 65.50
    assert created["category"] == "Food"

    # Get single expense
    get_res = client.get(f"/api/expenses/{created['id']}", headers=auth_headers)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == created["id"]


def test_expense_filtering_and_analytics(client, auth_headers):
    # Seed 3 expenses
    items = [
        {"title": "Lunch", "amount": 20.0, "category": "Food"},
        {"title": "Dinner", "amount": 30.0, "category": "Food"},
        {"title": "Electric Bill", "amount": 100.0, "category": "Utilities"}
    ]
    for item in items:
        client.post("/api/expenses", json=item, headers=auth_headers)

    # 1. Filter by category
    filter_res = client.get("/api/expenses?category=Food", headers=auth_headers)
    assert filter_res.status_code == 200
    food_items = filter_res.json()
    assert len(food_items) == 2

    # 2. Category Aggregation
    cat_res = client.get("/api/analytics/by-category", headers=auth_headers)
    assert cat_res.status_code == 200
    categories = cat_res.json()
    assert len(categories) == 2

    # Utilities should be $100 (highest), Food should be $50
    assert categories[0]["category"] == "Utilities"
    assert categories[0]["total_amount"] == 100.0
    assert categories[1]["category"] == "Food"
    assert categories[1]["total_amount"] == 50.0

    # 3. Dashboard Summary
    dash_res = client.get("/api/analytics/dashboard", headers=auth_headers)
    assert dash_res.status_code == 200
    dash_data = dash_res.json()
    assert dash_data["total_spent"] == 150.0
    assert dash_data["transaction_count"] == 3

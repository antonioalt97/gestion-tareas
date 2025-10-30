import requests
import sys
import json
from datetime import datetime, timezone, timedelta
import subprocess
import time

class TodoAPITester:
    def __init__(self, base_url="https://taskmaster-788.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.session_token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def create_test_user_and_session(self):
        """Create test user and session using mongosh"""
        print("\n🔧 Creating test user and session...")
        
        timestamp = int(time.time())
        user_id = f"test-user-{timestamp}"
        session_token = f"test_session_{timestamp}"
        
        mongosh_command = f"""
        use('test_database');
        var userId = '{user_id}';
        var sessionToken = '{session_token}';
        db.users.insertOne({{
          id: userId,
          email: 'test.user.{timestamp}@example.com',
          name: 'Test User {timestamp}',
          picture: 'https://via.placeholder.com/150',
          created_at: new Date().toISOString()
        }});
        db.user_sessions.insertOne({{
          user_id: userId,
          session_token: sessionToken,
          expires_at: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
          created_at: new Date().toISOString()
        }});
        print('SUCCESS: User and session created');
        """
        
        try:
            result = subprocess.run(
                ["mongosh", "--eval", mongosh_command],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0 and "SUCCESS" in result.stdout:
                self.session_token = session_token
                self.user_id = user_id
                print(f"✅ Test user created: {user_id}")
                print(f"✅ Session token: {session_token}")
                return True
            else:
                print(f"❌ Failed to create test user: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Error creating test user: {str(e)}")
            return False

    def test_auth_me(self):
        """Test /auth/me endpoint"""
        headers = {"Authorization": f"Bearer {self.session_token}"}
        
        try:
            response = requests.get(f"{self.api_url}/auth/me", headers=headers, timeout=10)
            
            if response.status_code == 200:
                user_data = response.json()
                if user_data.get('id') == self.user_id:
                    self.log_test("Auth Me", True)
                    return True
                else:
                    self.log_test("Auth Me", False, f"User ID mismatch: expected {self.user_id}, got {user_data.get('id')}")
                    return False
            else:
                self.log_test("Auth Me", False, f"Status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Auth Me", False, str(e))
            return False

    def test_create_task(self):
        """Test creating a new task"""
        headers = {
            "Authorization": f"Bearer {self.session_token}",
            "Content-Type": "application/json"
        }
        
        task_data = {
            "title": "Test Task",
            "description": "This is a test task",
            "priority": "high"
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/tasks",
                json=task_data,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                task = response.json()
                if task.get('title') == task_data['title'] and task.get('user_id') == self.user_id:
                    self.created_task_id = task.get('id')
                    self.log_test("Create Task", True)
                    return True
                else:
                    self.log_test("Create Task", False, "Task data mismatch")
                    return False
            else:
                self.log_test("Create Task", False, f"Status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Create Task", False, str(e))
            return False

    def test_get_tasks(self):
        """Test getting all tasks"""
        headers = {"Authorization": f"Bearer {self.session_token}"}
        
        try:
            response = requests.get(f"{self.api_url}/tasks", headers=headers, timeout=10)
            
            if response.status_code == 200:
                tasks = response.json()
                if isinstance(tasks, list) and len(tasks) > 0:
                    # Check if all tasks belong to the current user
                    user_tasks = [t for t in tasks if t.get('user_id') == self.user_id]
                    if len(user_tasks) == len(tasks):
                        self.log_test("Get Tasks", True)
                        return True
                    else:
                        self.log_test("Get Tasks", False, "Found tasks from other users")
                        return False
                else:
                    self.log_test("Get Tasks", True, "No tasks found (empty list)")
                    return True
            else:
                self.log_test("Get Tasks", False, f"Status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Tasks", False, str(e))
            return False

    def test_task_filters(self):
        """Test task filtering by status and priority"""
        headers = {"Authorization": f"Bearer {self.session_token}"}
        
        # Test status filter
        try:
            response = requests.get(f"{self.api_url}/tasks?status=pending", headers=headers, timeout=10)
            if response.status_code == 200:
                self.log_test("Filter by Status", True)
            else:
                self.log_test("Filter by Status", False, f"Status {response.status_code}")
                
        except Exception as e:
            self.log_test("Filter by Status", False, str(e))
        
        # Test priority filter
        try:
            response = requests.get(f"{self.api_url}/tasks?priority=high", headers=headers, timeout=10)
            if response.status_code == 200:
                self.log_test("Filter by Priority", True)
            else:
                self.log_test("Filter by Priority", False, f"Status {response.status_code}")
                
        except Exception as e:
            self.log_test("Filter by Priority", False, str(e))

    def test_update_task(self):
        """Test updating a task"""
        if not hasattr(self, 'created_task_id'):
            self.log_test("Update Task", False, "No task ID available")
            return False
            
        headers = {
            "Authorization": f"Bearer {self.session_token}",
            "Content-Type": "application/json"
        }
        
        update_data = {
            "status": "completed",
            "title": "Updated Test Task"
        }
        
        try:
            response = requests.put(
                f"{self.api_url}/tasks/{self.created_task_id}",
                json=update_data,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                task = response.json()
                if task.get('status') == 'completed' and task.get('title') == 'Updated Test Task':
                    self.log_test("Update Task", True)
                    return True
                else:
                    self.log_test("Update Task", False, "Task not updated correctly")
                    return False
            else:
                self.log_test("Update Task", False, f"Status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Update Task", False, str(e))
            return False

    def test_delete_task(self):
        """Test deleting a task"""
        if not hasattr(self, 'created_task_id'):
            self.log_test("Delete Task", False, "No task ID available")
            return False
            
        headers = {"Authorization": f"Bearer {self.session_token}"}
        
        try:
            response = requests.delete(
                f"{self.api_url}/tasks/{self.created_task_id}",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                self.log_test("Delete Task", True)
                return True
            else:
                self.log_test("Delete Task", False, f"Status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Delete Task", False, str(e))
            return False

    def test_logout(self):
        """Test logout endpoint"""
        headers = {"Authorization": f"Bearer {self.session_token}"}
        
        try:
            response = requests.post(f"{self.api_url}/auth/logout", headers=headers, timeout=10)
            
            if response.status_code == 200:
                self.log_test("Logout", True)
                return True
            else:
                self.log_test("Logout", False, f"Status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Logout", False, str(e))
            return False

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting Todo API Backend Tests")
        print(f"🔗 Testing API: {self.api_url}")
        
        # Create test user and session
        if not self.create_test_user_and_session():
            print("❌ Failed to create test user. Cannot proceed with API tests.")
            return False
        
        print(f"\n📋 Running API Tests with session: {self.session_token[:20]}...")
        
        # Run tests in order
        self.test_auth_me()
        self.test_create_task()
        self.test_get_tasks()
        self.test_task_filters()
        self.test_update_task()
        self.test_delete_task()
        self.test_logout()
        
        # Print summary
        print(f"\n📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All backend tests passed!")
            return True
        else:
            print("⚠️  Some backend tests failed. Check logs above.")
            return False

def main():
    tester = TodoAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
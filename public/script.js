async function fetchLeaveRequests() {
    try {
      const response = await fetch('/api/leave');
      if (!response.ok) {
        throw new Error('Failed to fetch leave requests');
      }
      const data = await response.json();
      return data.map(item => ({
        type: 'leave',
        message: `${item.message} - ${item.location || 'Location not available'}`
      }));
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch leave requests');
      return [];
    }
  }
  
  async function fetchAttendanceRequests() {
    try {
      const response = await fetch('/api/attendance');
      if (!response.ok) {
        throw new Error('Failed to fetch attendance requests');
      }
      const data = await response.json();
      return data.map(item => ({
        type: 'attendance',
        message: `Attendance marked: ${item.status} on ${item.date}`
      }));
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch attendance requests');
      return [];
    }
  }
  
  function updateNotificationList(notifications) {
    
    const notificationList = document.getElementById('notificationList');
    notificationList.innerHTML = '';
    notifications.forEach(notification => {
      const li = document.createElement('li');
      li.textContent = notification.message;
      notificationList.appendChild(li);
    });
  }
  
  function updateNotificationCount(count) {
    const notificationCount = document.getElementById('notificationCount');
    notificationCount.textContent = count.toString();
  }
  
  document.addEventListener('DOMContentLoaded', async () => {
    const leaveRequests = await fetchLeaveRequests();
    const attendanceRequests = await fetchAttendanceRequests();
    const notifications = [...leaveRequests, ...attendanceRequests];
    updateNotificationList(notifications);
    updateNotificationCount(notifications.length);
  
    const socket = io();
    socket.on('notification', (notification) => {
      const notificationList = document.getElementById('notificationList');
      const li = document.createElement('li');
      li.textContent = notification.message;
      notificationList.appendChild(li);
  
      const notificationCount = document.getElementById('notificationCount');
      notificationCount.textContent = (parseInt(notificationCount.textContent) + 1).toString();
  
      if (Notification.permission === 'granted') {
        new Notification('New Notification', {
          body: notification.message,
        });
      }
    });
  
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        }
      });
    }
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async position => {
        const { latitude, longitude } = position.coords;
        localStorage.setItem('latitude', latitude);
        localStorage.setItem('longitude', longitude);
  
        const location = await getLocationFromCoordinates(latitude, longitude);
        localStorage.setItem('location', location);
      }, error => {
        console.error('Error getting location:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  });
  
  async function getLocationFromCoordinates(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.address) {
        return `${data.address.city || data.address.town || data.address.village}, ${data.address.state}, ${data.address.country}`;
      } else {
        return 'Location not found';
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      return 'Error fetching location';
    }
  }
  
  const leaveForm = document.getElementById('leaveForm');
  leaveForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = document.getElementById('leaveMessage').value;
    const latitude = localStorage.getItem('latitude');
    const longitude = localStorage.getItem('longitude');
    const location = localStorage.getItem('location');
  
    try {
      const response = await fetch('/api/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: 'user_id', message, latitude, longitude, location })
      });
  
      if (response.ok) {
        alert('Leave request submitted successfully');
        document.getElementById('leaveMessage').value = '';
        const leaveRequests = await fetchLeaveRequests();
        const attendanceRequests = await fetchAttendanceRequests();
        const notifications = [...leaveRequests, ...attendanceRequests];
        updateNotificationList(notifications);
        updateNotificationCount(notifications.length);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit leave request');
    }
  });
  
  const attendanceForm = document.getElementById('attendanceForm');
  attendanceForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const date = document.getElementById('attendanceDate').value;
    const status = document.querySelector('input[name="attendanceStatus"]:checked').value;
  
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: 'user_id', date, status })
      });
  
      if (response.ok) {
        alert('Attendance recorded successfully');
        document.getElementById('attendanceDate').value = '';
        const leaveRequests = await fetchLeaveRequests();
        const attendanceRequests = await fetchAttendanceRequests();
        const notifications = [...leaveRequests, ...attendanceRequests];
        updateNotificationList(notifications);
        updateNotificationCount(notifications.length);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to record attendance');
    }
  });
  




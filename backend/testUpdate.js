async function testUpdate() {
  try {
    const usersRes = await fetch('http://localhost:3001/api/users');
    const usersData = await usersRes.json();
    const user = usersData.data[0];
    if (!user) {
      console.log('No user found');
      return;
    }

    console.log('Found user:', user.id);

    const updateRes = await fetch(`http://localhost:3001/api/users/${user.id}/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'userid': user.id 
      },
      body: JSON.stringify({ bio: "Test bio" })
    });
    
    const updateData = await updateRes.json();
    console.log('Update status:', updateRes.status);
    console.log('Update result:', updateData);
  } catch (err) {
    console.log('Update failed:', err);
  }
}

testUpdate();

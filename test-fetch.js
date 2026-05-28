
import fetch from 'node-fetch';

async function testFetch() {
  try {
    console.log('测试连接到本地AI服务器...');
    
    const response = await fetch('http://localhost:8000/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'test',
        messages: [{ role: 'user', content: '测试连接' }],
      }),
    });
    
    if (!response.ok) {
      console.log(`HTTP错误: ${response.status}`);
      return;
    }
    
    const data = await response.json();
    console.log('✓ 连接成功！');
    console.log('响应:', data.choices[0].message.content.slice(0, 100) + '...');
  } catch (error) {
    console.error('✗ 连接失败:', error.message);
  }
}

testFetch();

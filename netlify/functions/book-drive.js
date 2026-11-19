/**
 * Netlify Serverless Function: book-drive.js
 * Handles test drive bookings and custom build reservations for BMW M-APEX
 * Accessible at /.netlify/functions/book-drive and /api/book-drive
 */

exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  // Health check / info via GET
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'online',
        service: 'BMW M-APEX VIP Driving Experience API',
        version: '2.4.0',
        availableTracks: [
          'Nürburgring Nordschleife Experience Center (Germany)',
          'BMW M Performance Center Spartanburg (USA)',
          'Silverstone GP Circuit M Pavilion (UK)',
          'Dubai Autodrome M VIP Lounge (UAE)',
          'Yas Marina Circuit M Experience (Abu Dhabi)'
        ],
        timestamp: new Date().toISOString()
      })
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed. Use POST to book a drive.' })
    };
  }

  try {
    let payload = {};
    if (event.body) {
      try {
        let rawBody = event.body;
        if (event.isBase64Encoded && typeof rawBody === 'string') {
          rawBody = Buffer.from(rawBody, 'base64').toString('utf-8');
        }
        payload = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
      } catch (parseErr) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid JSON payload received.', details: parseErr.message })
        };
      }
    }

    const {
      name,
      email,
      phone = 'N/A',
      model = 'BMW M4 Competition Coupé',
      track = 'Nürburgring Nordschleife Experience Center',
      date = new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      driveMode = 'Track / Sport+ (Instructor Led)',
      buildCode = null,
      customSpecs = null
    } = payload;

    // Validate required fields
    if (!name || name.trim().length < 2) {
      return {
        statusCode: 422,
        headers,
        body: JSON.stringify({ error: 'Full name is required (minimum 2 characters).' })
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return {
        statusCode: 422,
        headers,
        body: JSON.stringify({ error: 'A valid email address is required.' })
      };
    }

    // Generate VIP booking ID
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const bookingId = `M-APEX-${randomSuffix}`;
    const confirmationToken = Buffer.from(`${bookingId}:${email}:${Date.now()}`).toString('base64');

    const responseData = {
      success: true,
      bookingId,
      status: 'CONFIRMED',
      confirmationToken,
      client: {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim()
      },
      reservation: {
        model,
        track,
        date,
        driveMode,
        instructorAssigned: 'BMW M Factory Certified Pilot',
        telemetryLogging: true,
        vipLoungeAccess: true,
        buildCode: buildCode || `M-BLD-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        customSpecs: customSpecs || {
          exteriorColor: 'Isle of Man Green Metallic',
          wheels: 'Style 826M Bicolor Forged',
          interior: 'Merino Leather with M-Tri Stitching',
          carbonPackage: true
        }
      },
      message: `Congratulations ${name.trim()}! Your VIP BMW M Track Session has been officially reserved.`,
      dispatchNotice: 'A confirmation dossier and digital pit-lane pass have been dispatched to your email.',
      timestamp: new Date().toISOString()
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseData)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error processing test drive booking.',
        details: error.message
      })
    };
  }
};

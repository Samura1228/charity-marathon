// Netlify Serverless Function — Registration Handler
// Uses Node.js 18+ built-in fetch for reliable redirect handling

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwPp304YQUA98WgmlqBh5CbmzTadTZBSb0xZUoSOhbk1L9Un43YscSxuDgw5kF7-Z8k/exec';

exports.handler = async function(event) {
    var headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers: headers, body: JSON.stringify({ status: 'error', message: 'Method not allowed' }) };
    }

    try {
        var formData = JSON.parse(event.body);

        // Build GET URL with all form data as query parameters
        var params = new URLSearchParams();
        params.append('action', 'register');
        params.append('firstName', formData.firstName || '');
        params.append('lastName', formData.lastName || '');
        params.append('email', formData.email || '');
        params.append('phone', formData.phone || '');
        params.append('distance', formData.distance || '');
        params.append('tshirtSize', formData.tshirtSize || '');
        params.append('emergencyName', formData.emergencyName || '');
        params.append('emergencyPhone', formData.emergencyPhone || '');
        params.append('registrationDate', formData.registrationDate || '');
        params.append('language', formData.language || '');

        var url = GOOGLE_SCRIPT_URL + '?' + params.toString();

        // Use Node.js 18+ built-in fetch — handles redirects automatically
        var response = await fetch(url, {
            method: 'GET',
            redirect: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; NetlifyFunction/1.0)'
            }
        });

        var responseText = await response.text();

        // Return the actual Apps Script response for debugging
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({
                status: 'success',
                message: 'Registration sent',
                debug: {
                    httpStatus: response.status,
                    appsScriptResponse: responseText.substring(0, 500)
                }
            })
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ status: 'error', message: error.message, stack: error.stack })
        };
    }
};
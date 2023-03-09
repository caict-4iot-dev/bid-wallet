
module.exports = {
  name: 'Bid Wallet',
  version: '1.0.0',
  description: 'The Entrance to BID',
  manifest_version: 3,
  icons: {
	  '16': 'images/icon-logo.16x16.png',
	  '48': 'images/icon-logo.48x48.png',
	  '128': 'images/icon-logo.128x128.png'
  },
  permissions: [
    'storage',
    'background'
    // 'tabs'
  ],
  action: {
    default_title: 'BID wallet',
    default_popup: 'pages/popup.html'
  },
  background: {
    service_worker: 'bg-wrapper.js'
  },
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: [
        'js/inject.js'
      ],
      run_at: 'document_end',
      all_frames: true
    }
  ],
  content_security_policy: {
    'extension_pages': "script-src 'self'; object-src 'self'"
  },
  web_accessible_resources: [
    {
      resources: [
        'js/content.js',
        'js/inject.js'
      ],
      matches: [
        '<all_urls>'
      ]
    }
  ],
  externally_connectable: {
    ids: ['*']
  }
}

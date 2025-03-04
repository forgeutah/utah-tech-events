-- Seed data for events table

INSERT INTO events (title, description, group_name, tags, date_time, location, event_link, created_at, updated_at)
VALUES 
  ('Go Meetup', 'Monthly meetup for Go developers', 'Golang Users Group', 
   ARRAY['golang', 'programming'], '2023-04-15T18:00:00Z', 'Salt Lake City, UT', 
   'https://example.com/go-meetup', NOW(), NOW()),
   
  ('AI Conference', 'Annual AI conference', 'Utah AI Group', 
   ARRAY['ai', 'machine-learning', 'conferences'], '2023-05-20T09:00:00Z', 'Provo, UT', 
   'https://example.com/ai-conf', NOW(), NOW()),
   
  ('JavaScript Workshop', 'Hands-on JavaScript workshop', 'Utah JS', 
   ARRAY['javascript', 'web-development'], '2023-04-22T10:00:00Z', 'Lehi, UT', 
   'https://example.com/js-workshop', NOW(), NOW()),
   
  ('DevOps Meetup', 'Discussion about CI/CD pipelines', 'Utah DevOps', 
   ARRAY['devops', 'ci-cd', 'automation'], '2023-04-28T18:30:00Z', 'Salt Lake City, UT', 
   'https://example.com/devops-meetup', NOW(), NOW()),
   
  ('Data Science Summit', 'Summit for data scientists', 'Utah Data Science', 
   ARRAY['data-science', 'machine-learning', 'ai'], '2023-06-10T09:00:00Z', 'Park City, UT', 
   'https://example.com/data-summit', NOW(), NOW()),
   
  ('Cybersecurity Conference', 'Annual cybersecurity conference', 'Utah Security Group', 
   ARRAY['security', 'cybersecurity', 'conferences'], '2023-07-15T08:00:00Z', 'Sandy, UT', 
   'https://example.com/security-conf', NOW(), NOW()),
   
  ('Python Meetup', 'Monthly Python user group meeting', 'Utah Python', 
   ARRAY['python', 'programming'], '2023-05-05T19:00:00Z', 'Salt Lake City, UT', 
   'https://example.com/python-meetup', NOW(), NOW()),
   
  ('Web Accessibility Workshop', 'Learn about web accessibility standards', 'Utah Web Dev', 
   ARRAY['accessibility', 'web-development'], '2023-05-12T14:00:00Z', 'Draper, UT', 
   'https://example.com/accessibility-workshop', NOW(), NOW()),
   
  ('Blockchain Technology Seminar', 'Introduction to blockchain', 'Utah Blockchain', 
   ARRAY['blockchain', 'cryptocurrency'], '2023-06-20T18:00:00Z', 'Salt Lake City, UT', 
   'https://example.com/blockchain-seminar', NOW(), NOW()),
   
  ('Mobile App Development Workshop', 'Building iOS and Android apps', 'Utah Mobile Devs', 
   ARRAY['mobile', 'ios', 'android'], '2023-05-25T09:30:00Z', 'Orem, UT', 
   'https://example.com/mobile-workshop', NOW(), NOW()),
   
  ('Cloud Computing Summit', 'AWS, Azure, and GCP discussions', 'Utah Cloud', 
   ARRAY['cloud', 'aws', 'azure', 'gcp'], '2023-07-05T10:00:00Z', 'Salt Lake City, UT', 
   'https://example.com/cloud-summit', NOW(), NOW()),
   
  ('Tech Startup Networking', 'Networking event for tech startups', 'Utah Startups', 
   ARRAY['startups', 'networking'], '2023-04-30T17:00:00Z', 'Lehi, UT', 
   'https://example.com/startup-networking', NOW(), NOW());

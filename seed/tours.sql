INSERT INTO tours (slug, title, location, cover_image, published, sort_order, source_url) VALUES
('vechernyaya-obzornaya-ekskursiya-po-nyachangu', 'Вечерняя обзорная экскурсия по Нячангу', 'Нячанг', 'https://static.tildacdn.one/tild3561-3935-4830-b462-323432643731/nha-trang-city-tour-.png', 1, 10, 'https://maxtourvietnam.com/vechernyaya-obzornaya-ekskursiya-po-nyachangu'),
('ekskursiya-v-fuyen-iz-nyachanga', 'Экскурсия в провинцию Фуйен', 'Фуйен', 'https://static.tildacdn.one/tild3931-3439-4539-b865-623431343161/Phu-yen_3.png', 1, 20, 'https://maxtourvietnam.com/ekskursiya-v-fuyen-iz-nyachanga'),
('ekskursiya-v-dalat-na-2-dnya-iz-nyachanga', 'Экскурсия в Далат на 2 дня из Нячанга', 'Далат', 'https://static.tildacdn.net/tild3231-6337-4638-a134-303463303839/IMG_20251030_130346_.jpg', 1, 30, 'https://maxtourvietnam.com/ekskursiya-v-dalat-na-2-dnya-iz-nyachanga'),
('vip-ekskursiya-v-dalat-iz-nyachanga', 'Экскурсия в Далат «ВИП» из Нячанга', 'Далат', 'https://static.tildacdn.one/tild3036-6635-4135-b631-636538376635/10.jpg', 1, 40, 'https://maxtourvietnam.com/vip-ekskursiya-v-dalat-iz-nyachanga'),
('ekskursiya-v-dalat-iz-nyachanga-premium', 'Экскурсия в Далат из Нячанга Премиум', 'Далат', 'https://static.tildacdn.one/tild3334-3434-4230-a637-383934633961/11.jpg', 1, 50, 'https://maxtourvietnam.com/ekskursiya-v-dalat-iz-nyachanga-premium'),
('dnevnaya-obzornaya-ekskursiya-po-nyachangu', 'Дневная обзорная экскурсия по Нячангу', 'Нячанг', 'https://static.tildacdn.one/tild6638-6230-4633-b838-366163306231/nha-trang-city-tour-.png', 1, 60, 'https://maxtourvietnam.com/dnevnaya-obzornaya-ekskursiya-po-nyachangu'),
('ekskursiya-v-dalat-so-steklyannym-mostom-iz-nyachanga', 'Экскурсия в Далат со стеклянным мостом из Нячанга', 'Далат', 'https://static.tildacdn.one/tild3539-6164-4030-b562-613039326233/13.jpg', 1, 70, 'https://maxtourvietnam.com/ekskursiya-v-dalat-so-steklyannym-mostom-iz-nyachanga'),
('ekskursiya-baho-zoklet-iz-nyachanga', 'Экскурсия на водопад Бахо и пляж Зоклет', 'Нячанг', 'https://static.tildacdn.one/tild3732-3461-4265-a662-383135643934/12.jpg', 1, 80, 'https://maxtourvietnam.com/ekskursiya-baho-zoklet-iz-nyachanga'),
('ostrov-hon-tam-nyachang', 'Остров Хон Там', 'Нячанг', 'https://static.tildacdn.one/tild3861-6231-4462-a235-663762633665/ostrov-hon-tam-2.png', 1, 90, 'https://maxtourvietnam.com/ostrov-hon-tam-nyachang'),
('ostrov-orhidey-i-obezian-nyachang', 'Остров Орхидей и остров Обезьян', 'Нячанг', 'https://static.tildacdn.one/tild3434-6534-4637-a137-383063623031/ostrov-orhidey-i-obe.png', 1, 100, 'https://maxtourvietnam.com/ostrov-orhidey-i-obezian-nyachang'),
('dayving-i-snorkling-v-nyachange', 'Дайвинг и снорклинг в Нячанге', 'Нячанг', 'https://static.tildacdn.one/tild6239-6432-4331-a533-633333326634/extrim-1.png', 1, 110, 'https://maxtourvietnam.com/dayving-i-snorkling-v-nyachange'),
('ekskursiya-v-danang-iz-nyachanga', 'Экскурсия в Дананг из Нячанга', 'Дананг', 'https://static.tildacdn.one/tild6630-3532-4338-b331-386631393866/danang-13.png', 1, 120, 'https://maxtourvietnam.com/ekskursiya-v-danang-iz-nyachanga'),
('ekskursiya-v-saygon-iz-nyachanga', 'Экскурсия в Сайгон из Нячанга', 'Сайгон', 'https://static.tildacdn.one/tild6135-6531-4963-a264-613866353466/saigon-tour-10.png', 1, 130, 'https://maxtourvietnam.com/ekskursiya-v-saygon-iz-nyachanga'),
('ekskursiya-v-fanrang-iz-nyachanga', 'Экскурсия в Фанранг из Нячанга', 'Фанранг', 'https://static.tildacdn.one/tild6138-6264-4135-b235-313662326165/_-3.jpg', 1, 140, 'https://maxtourvietnam.com/ekskursiya-v-fanrang-iz-nyachanga')
ON CONFLICT(slug) DO UPDATE SET
  title = excluded.title,
  location = excluded.location,
  cover_image = excluded.cover_image,
  published = excluded.published,
  sort_order = excluded.sort_order,
  source_url = excluded.source_url,
  updated_at = CURRENT_TIMESTAMP;

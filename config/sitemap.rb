SitemapGenerator::Sitemap.default_host = "http://muanhaonline.vn"

SitemapGenerator::Sitemap.create do

	add '/tim_kiem'

	# Real-estate

		add '/bat-dong-san'
		add '/bat-dong-san/dang-tin'

		add '/bat-dong-san/danh-sach-dat-tho-cu'
		add '/bat-dong-san/danh-sach-dat-nong-nghiep'
		add '/bat-dong-san/danh-sach-dat-lam-nghiep'
		add '/bat-dong-san/danh-sach-dat-san-xuat'
		add '/bat-dong-san/danh-sach-dat-du-an'
		add '/bat-dong-san/danh-sach-van-phong'
		add '/bat-dong-san/danh-sach-phong-tro'
		add '/bat-dong-san/danh-sach-mat-bang-cua-hang'
		add '/bat-dong-san/danh-sach-nha-kho-xuong'
		add '/bat-dong-san/danh-sach-can-ho-cao-cap'
		add '/bat-dong-san/danh-sach-can-ho-trung-binh'
		add '/bat-dong-san/danh-sach-can-ho-thap'
		add '/bat-dong-san/danh-sach-nha-o-xa-hoi'
		add '/bat-dong-san/danh-sach-biet-thu'
		add '/bat-dong-san/danh-sach-nha-pho'
		add '/bat-dong-san/danh-sach-nha-tam'
		add '/bat-dong-san/danh-sach-nha-cap-4'
		add '/bat-dong-san/danh-sach-can-ho-co-ho-boi'
		add '/bat-dong-san/danh-sach-nha-pho-duoi-1-ty'

		RealEstate.search_with_params.each do |re|

			add "/bat-dong-san/#{re.full_slug}"

		end
	
	# / Real-estate

end
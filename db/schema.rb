# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150324084652) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "advantages", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "constructional_levels", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "currencies", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "directions", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "disadvantages", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "districts", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.integer  "province_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "images", force: :cascade do |t|
    t.text     "path"
    t.text     "options"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "legal_record_types", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "planning_status_types", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "provinces", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "purposes", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "real_estate_advantages", force: :cascade do |t|
    t.integer  "real_estate_id"
    t.integer  "advantage_id"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "real_estate_disadvantages", force: :cascade do |t|
    t.integer  "real_estate_id"
    t.integer  "disadvantage_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  create_table "real_estate_images", force: :cascade do |t|
    t.integer  "real_estate_id"
    t.integer  "image_id"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "real_estate_real_estate_utilities", force: :cascade do |t|
    t.integer  "real_estate_id"
    t.integer  "real_estate_utility_id"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "real_estate_region_utilities", force: :cascade do |t|
    t.integer  "real_estate_id"
    t.integer  "region_utility_id"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
  end

  create_table "real_estate_types", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "real_estate_utilities", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "real_estates", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "region_utilities", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "street_types", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "streets", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.integer  "ward_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "units", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "wards", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.integer  "district_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

end

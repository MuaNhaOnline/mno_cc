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

ActiveRecord::Schema.define(version: 20150420113634) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "advantages", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.integer  "index"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "order"
  end

  create_table "advantages_real_estates", force: :cascade do |t|
    t.integer  "real_estate_id"
    t.integer  "advantage_id"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "constructional_levels", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.integer  "index"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "order"
  end

  create_table "currencies", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.integer  "index"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "order"
  end

  create_table "directions", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.integer  "index"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "order"
  end

  create_table "disadvantages", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.integer  "index"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "order"
  end

  create_table "disadvantages_real_estates", force: :cascade do |t|
    t.integer  "real_estate_id"
    t.integer  "disadvantage_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  create_table "districts", force: :cascade do |t|
    t.text    "name"
    t.text    "code"
    t.integer "province_id"
    t.integer "order"
  end

  create_table "images", force: :cascade do |t|
    t.text     "folder"
    t.text     "options"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text     "name"
    t.text     "type"
  end

  create_table "images_real_estates", force: :cascade do |t|
    t.integer  "real_estate_id"
    t.integer  "image_id"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "legal_record_types", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.integer  "index"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "order"
  end

  create_table "planning_status_types", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.integer  "index"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "order"
  end

  create_table "property_utilities", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "order"
  end

  create_table "property_utilities_real_estates", force: :cascade do |t|
    t.integer  "real_estate_id"
    t.integer  "property_utility_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
  end

  create_table "provinces", force: :cascade do |t|
    t.text    "name"
    t.text    "code"
    t.integer "order"
  end

  create_table "purposes", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.integer  "index"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "order"
  end

  create_table "real_estate_types", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.integer  "index"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "order"
  end

  create_table "real_estate_utilities", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.integer  "index"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "real_estates", force: :cascade do |t|
    t.datetime "created_at",                              null: false
    t.datetime "updated_at",                              null: false
    t.text     "title"
    t.text     "description"
    t.text     "name"
    t.integer  "purpose_id"
    t.decimal  "price"
    t.integer  "currency_id"
    t.integer  "unit_id"
    t.integer  "is_negotiable"
    t.integer  "province_id"
    t.integer  "district_id"
    t.integer  "ward_id"
    t.integer  "street_id"
    t.text     "address_number"
    t.integer  "street_type_id"
    t.integer  "is_alley"
    t.decimal  "alley_width"
    t.integer  "real_estate_type_id"
    t.decimal  "campus_area"
    t.decimal  "using_area"
    t.integer  "floor_number"
    t.integer  "restroom_number"
    t.integer  "bedroom_number"
    t.integer  "direction_id"
    t.integer  "build_year"
    t.integer  "constructional_quality"
    t.decimal  "constructional_area"
    t.integer  "constructional_level_id"
    t.decimal  "width_x"
    t.decimal  "width_y"
    t.integer  "shape"
    t.decimal  "shape_width"
    t.integer  "legal_record_type_id"
    t.text     "custom_legal_record_type"
    t.integer  "planning_status_type_id"
    t.text     "custom_planning_status_type"
    t.text     "custom_advantages"
    t.text     "custom_disadvantages"
    t.integer  "is_show",                     default: 1
    t.datetime "expired_time"
    t.decimal  "ads_cost"
    t.integer  "is_paid",                     default: 1
    t.text     "options"
    t.integer  "is_pending",                  default: 1
  end

  create_table "real_estates_region_utilities", force: :cascade do |t|
    t.integer  "real_estate_id"
    t.integer  "region_utility_id"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
  end

  create_table "region_utilities", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.integer  "index"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "order"
  end

  create_table "street_types", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.integer  "index"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "order"
  end

  create_table "streets", force: :cascade do |t|
    t.text    "name"
    t.text    "code"
    t.integer "province_id"
    t.integer "order"
  end

  create_table "units", force: :cascade do |t|
    t.text     "name"
    t.text     "code"
    t.text     "options"
    t.integer  "index"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "order"
  end

  create_table "wards", force: :cascade do |t|
    t.text    "name"
    t.text    "code"
    t.integer "province_id"
    t.integer "order"
  end

end

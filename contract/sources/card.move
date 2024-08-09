module anki::card {
    use std::string::String;

    use moveos_std::event::emit;
    use moveos_std::object::{Self, Object, ObjectID};
    use moveos_std::signer;
    use moveos_std::timestamp;

    const SECONDS_PER_DAY: u64 = 86400; // 24 * 60 * 60

    struct Card has key, store {
        front: String,
        back: String,
        interval: u64,
        ease_factor: u64,
        due_date: u64,
        review_count: u64,
    }

    struct CardDeletedEvent has copy, store, drop {
        id: ObjectID,
    }

    struct CardReviewEvent has copy, store, drop {
        id: ObjectID,
        quality: u8,
        due_date: u64,
        current_time: u64,
        review_count: u64,
    }

    public fun create_card(creator: &signer, front: String, back: String): ObjectID {
        let _ = creator;

        let initial_due_date = get_day_start(timestamp::now_seconds()) + (SECONDS_PER_DAY - 1);

        let card = Card {
            front,
            back,
            interval: 1,
            ease_factor: 2500, // init ef 2.5
            due_date: initial_due_date,
            review_count: 0,
        };
        let card_obj = object::new(card);
        let card_id = object::id(&card_obj);
        object::transfer(card_obj, signer::address_of(creator));
        card_id
    }

    public fun delete_card(owner: &signer, card_obj: Object<Card>) {
        let _ = owner;
        let card_id = object::id(&card_obj);
        let card = object::remove(card_obj);
        emit(CardDeletedEvent { id: card_id });
        drop_card(card);
    }

    public fun delete_card_by_id(owner: &signer, card_id: ObjectID) {
        let card_obj = object::take_object<Card>(owner, card_id);
        delete_card(owner, card_obj);
    }

    fun review_card(
        owner: &signer,
        card_obj: &mut Object<Card>,
        quality: u8,
        current_time: u64 // set current_time to 0 to use timestamp::now_seconds()
    ) {
        assert!(object::owner(card_obj) == signer::address_of(owner), 1); // ensure only owner can review card

        let card = object::borrow_mut(card_obj);
        let new_interval = calculate_interval(card.interval, card.ease_factor, quality, card.review_count);
        card.interval = new_interval;
        card.ease_factor = adjust_ease_factor(card.ease_factor, quality);

        // Set due_date to the end of the day after new_interval days
        let current_time = if (current_time > 0) { current_time } else { timestamp::now_seconds() };
        let due_date = get_day_start(current_time) + (new_interval * SECONDS_PER_DAY) + (SECONDS_PER_DAY - 1);
        card.due_date = due_date;

        let new_review_count = card.review_count + 1;
        card.review_count = new_review_count;

        let card_id = object::id(card_obj);

        emit(
            CardReviewEvent {
                id: card_id,
                quality,
                due_date,
                current_time,
                review_count: new_review_count
            }
        );
    }

    public entry fun review_card_entry(
        owner: &signer, card_obj_id: ObjectID, quality: u8
    ) {
        let card_obj = object::borrow_mut_object(owner, card_obj_id);
        review_card(owner, card_obj, quality, 0);
    }

    public entry fun review_card_entry_for_testing(
        owner: &signer, card_obj_id: ObjectID, quality: u8, current_time: u64
    ) {
        let card_obj = object::borrow_mut_object(owner, card_obj_id);
        review_card(owner, card_obj, quality, current_time);
    }

    public fun get_due_date(card_obj: &Object<Card>): u64 {
        let card = object::borrow(card_obj);
        card.due_date
    }

    public fun is_due(card: &Card): bool {
        let current_day_start = get_day_start(timestamp::now_seconds());
        current_day_start >= get_day_start(card.due_date)
    }

    fun calculate_interval(
        current_interval: u64, ease_factor: u64, quality: u8, review_count: u64
    ): u64 {
        if (quality < 3) {
            1 // if answer is bad, reset to 1 day
        } else if (review_count == 0) {
            // first review
            1
        } else {
            let new_interval = (((current_interval as u128) * (ease_factor as u128) / 1000) as u64);
            if (new_interval < 1) { 1 } else { new_interval }
        }
    }

    fun adjust_ease_factor(current_ef: u64, quality: u8): u64 {
        let new_ef = if (quality == 1) { current_ef - 200 }
        else if (quality == 2) { current_ef - 150 }
        else if (quality == 3) { current_ef }
        else if (quality == 4) { current_ef + 150 }
        else { current_ef + 200 };

        if (new_ef < 1300) { 1300 }
        else if (new_ef > 5000) { 5000 }
        else { new_ef }
    }

    fun drop_card(card: Card) {
        let Card {
            front: _front,
            back: _back,
            interval: _interval,
            ease_factor: _ease_factor,
            due_date: _due_date,
            review_count: _review_count,
        } = card;
    }

    fun get_day_start(time: u64): u64 {
        time - (time % SECONDS_PER_DAY)
    }
}

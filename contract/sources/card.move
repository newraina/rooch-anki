module anki::card {
    use std::string::String;

    use moveos_std::event::emit;
    use moveos_std::object::{Self, Object, ObjectID};
    use moveos_std::signer;

    struct Card has key, store {
        front: String,
        back: String,
        interval: u64,
        ease_factor: u64,
        due_date: u64,
    }

    struct CardDeletedEvent has copy, store, drop {
        id: ObjectID,
    }

    public fun create_card(creator: &signer, front: String, back: String): ObjectID {
        let _ = creator;
        let card = Card {
            front,
            back,
            interval: 0,
            ease_factor: 2500, // init ef 2.5
            due_date: 0,
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

    fun drop_card(card: Card) {
        let Card {
            front: _front,
            back: _back,
            interval: _interval,
            ease_factor: _ease_factor,
            due_date: _due_date,
        } = card;
    }


    public fun review_card(
        owner: &signer, card_obj: &mut Object<Card>, quality: u8, current_date: u64
    ) {
        assert!(object::owner(card_obj) == signer::address_of(owner), 1); // ensure only owner can review card
        let card = object::borrow_mut(card_obj);
        let new_interval = calculate_interval(card.interval, card.ease_factor, quality);
        card.interval = new_interval;
        card.ease_factor = adjust_ease_factor(card.ease_factor, quality);
        card.due_date = current_date + new_interval;
    }

    public fun get_due_date(card_obj: &Object<Card>): u64 {
        let card = object::borrow(card_obj);
        card.due_date
    }

    fun calculate_interval(
        current_interval: u64, ease_factor: u64, quality: u8
    ): u64 {
        if (quality < 3) {
            1 // if answer is bad, reset to 1 day
        } else {
            let new_interval =
                ((((current_interval as u128) * (ease_factor as u128)) / 1000) as u64);
            if (new_interval < 1) { 1 }
            else {
                new_interval
            }
        }
    }

    fun adjust_ease_factor(current_ef: u64, quality: u8): u64 {
        let adjustment =
            if (quality == 0) { 200 }
            else if (quality == 1) { 150 }
            else if (quality == 2) { 100 }
            else if (quality == 3) { 0 }
            else if (quality == 4) { 150 }
            else { 200 };

        let new_ef = if (quality < 3) {
            current_ef - adjustment
        } else {
            current_ef + adjustment
        };
        if (new_ef < 1300) { 1300 }
        else if (new_ef > 5000) { 5000 }
        else { new_ef }
    }
}

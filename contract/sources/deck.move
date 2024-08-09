module anki::deck {
    use std::signer;
    use std::string;
    use std::string::String;
    use std::vector;

    use anki::card::{Self, Card};
    use moveos_std::event;
    use moveos_std::event::emit;
    use moveos_std::object::{Self, Object, ObjectID};

    struct Deck has key, store {
        name: String,
        description: String,
        cards: vector<ObjectID>,
    }

    struct DeckCreatedEvent has copy, store, drop {
        id: ObjectID,
        creator: address,
    }

    struct DeckNameEditedEvent has copy, store, drop {
        id: ObjectID,
        new_name: String,
        old_name: String,
    }

    struct DeckDeletedEvent has copy, store, drop {
        id: ObjectID,
    }

    const ErrorDataTooLong: u64 = 1;
    const ErrorDataEmpty: u64 = 2;
    const ErrorNotFound: u64 = 3;

    public fun create_deck(creator: &signer, name: String, description: String): ObjectID {
        let _ = creator;
        let creator_address = signer::address_of(creator);

        check_name(name);

        let deck = Deck { name, description, cards: vector::empty(), };
        let deck_obj = object::new(deck);
        let deck_id = object::id(&deck_obj);
        event::emit(DeckCreatedEvent { id: deck_id, creator: creator_address });
        object::transfer(deck_obj, creator_address);
        deck_id
    }

    public entry fun create_deck_entry(creator: &signer, name: String, description: String) {
        create_deck(creator, name, description);
    }

    public fun delete_deck(owner: &signer, deck_id: ObjectID) {
        let _ = owner;
        let deck_obj = object::take_object<Deck>(owner, deck_id);
        let Deck { name: _, description: _, cards } = object::remove(deck_obj);
        emit(DeckDeletedEvent { id: deck_id });

        vector::for_each(
            cards,
            |card_id| {
                card::delete_card_by_id(owner, card_id);
            },
        );
    }

    public entry fun delete_deck_entry(owner: &signer, deck_id: ObjectID) {
        delete_deck(owner, deck_id);
    }

    public fun edit_deck_name(
        owner: &signer, deck_id: ObjectID, new_name: String
    ) {
        let _ = owner;
        check_name(new_name);

        let deck_obj = object::borrow_mut_object<Deck>(owner, deck_id);
        let deck = object::borrow_mut(deck_obj);
        let old_name = deck.name;
        deck.name = new_name;
        emit(DeckNameEditedEvent { id: deck_id, new_name, old_name });
    }

    public entry fun edit_deck_name_entry(
        owner: &signer, deck_id: ObjectID, new_name: String
    ) {
        edit_deck_name(owner, deck_id, new_name);
    }

    public fun add_card(
        owner: &signer, deck_obj: &mut Object<Deck>, front: String, back: String
    ) {
        let _ = owner;

        // assert!(object::owner(deck_obj) == signer::address_of(owner), 1); // ensure only owner can add card
        let deck = object::borrow_mut(deck_obj);
        let new_card_id = card::create_card(owner, front, back);
        vector::push_back(&mut deck.cards, new_card_id);
    }

    public entry fun add_card_entry(
        owner: &signer, deck_obj: &mut Object<Deck>, front: String, back: String
    ) {
        add_card(owner, deck_obj, front, back);
    }

    public fun remove_card_from_deck(
        owner: &signer, deck_obj: &mut Object<Deck>, card_obj: Object<Card>
    ) {
        let _ = owner;

        // assert!(object::owner(deck_obj) == signer::address_of(owner), 1); // ensure only owner can remove card
        let deck = object::borrow_mut(deck_obj);
        let card_id = object::id(&card_obj);
        let (contains, card_index) = vector::index_of(&deck.cards, &card_id);
        assert!(contains, ErrorNotFound);
        vector::remove(&mut deck.cards, card_index);
        card::delete_card(owner, card_obj);
    }

    public entry fun remove_card_from_deck_entry(
        owner: &signer, deck_obj: &mut Object<Deck>, card_obj: Object<Card>
    ) {
        remove_card_from_deck(owner, deck_obj, card_obj);
    }

    public fun get_due_cards(owner: &signer, deck_obj: &Object<Deck>): vector<ObjectID> {
        let _ = owner;

        // assert!(object::owner(deck_obj) == signer::address_of(owner), 1); // ensure only owner can get due cards
        let deck = object::borrow(deck_obj);
        let due_cards = vector::empty<ObjectID>();
        let i = 0;
        let len = vector::length(&deck.cards);
        while (i < len) {
            let card_id = vector::borrow(&deck.cards, i);
            let card_obj = object::borrow_object<Card>(*card_id);
            let card = object::borrow(card_obj);
            if (card::is_due(card)) {
                vector::push_back(&mut due_cards, *card_id);
            };
            i = i + 1;
        };
        due_cards
    }

    fun check_name(name: String) {
        assert!(string::length(&name) > 0, ErrorDataEmpty);
        assert!(string::length(&name) < 100, ErrorDataTooLong);
    }
}

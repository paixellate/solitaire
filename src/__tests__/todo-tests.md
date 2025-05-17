Bugs / Test Cases:

Tableau Pile:
* Click on area outside the pile dimensions. ie when cards are stacked on pile, try to select card by clicking in an area of card that is outside the pile bounds.
  * The card should successfully get selected.
  * Clicking should successfully trigger the auto property.

* Setup the stock pile such that the top card on the stock pile is valid to attach to a tableau pile face up card. Then empty the stock pile and click on stock pile to pick up all the cards. Drag these cards to the face up card on the tableau pile. The cards should not attach.
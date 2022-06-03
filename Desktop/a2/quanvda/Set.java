package a2.quanvda;

import java.util.Vector;

import utils.DOpt;
import utils.DomainConstraint;
import utils.OptType;
import utils.collections.Collection;

/**
 * @overview Generic set are mutable, unbounded sets of elements of a given type. 
 *  Element type can be Object.
 *
 * @attributes
 *   elements   Set<T>  Vector<T>
 * @object A typical Set<T> object is c={x1,...,xn}, where x1,...,xn are
 *   elements of type T.
 * @abstract_properties
 *  optional(elements) = false /\ 
 *  for all x in elements. x is T /\ 
 *  for all x, y in elements. x.equals(y)
 */
public class Set<T> implements Collection<T> {
    @DomainConstraint(type = "Vector", optional = false)
    private final Vector<T> elements; // use generic syntax

    /**
     * @effects initialise this to be empty
     */
    public Set() {
        this.elements = new Vector<>();
    }

    /**
     * @modifies this
     * @effects
     *   if x is already in this
     *     do nothing
     *   else
     *     add x to this, i.e., this_post = this + {x}
     */
    @DOpt(type = OptType.MutatorAdd)
    public void insert(final T x) {
        if (this.getIndex(x) < 0)
            this.elements.add(x);
    }

    /**
     * @modifies this
     * @effects
     *   if x is not in this
     *     do nothing
     *   else
     *     remove x from this, i.e.
     *     this_post = this - {x}
     */
    @DOpt(type = OptType.MutatorRemove)
    public void remove(final T x) {
        final int i = this.getIndex(x);
        if (i < 0)
            return;
        this.elements.set(i, this.elements.lastElement());
        this.elements.remove(this.elements.size() - 1);
    }

    /**
     * @effects
     *  if x is in this
     *    return true
     *  else
     *    return false
     */
    @DOpt(type = OptType.ObserverContains)
    public boolean isIn(final T x) {
        return (this.getIndex(x) >= 0);
    }


    /**
     * @effects return the cardinality of this
     */
    @DOpt(type = OptType.ObserverSize)
    public int size() {
        return this.elements.size();
    }

    /**
     * @effects
     *  if this is not empty
     *    return a new Vector<T> of elements of this
     *  else
     *    return null
     */
    @DOpt(type = OptType.Observer)
    public Vector<T> getElements() {
        if (this.size() == 0)
            return null;
        else {
            final Vector<T> els = new Vector<>();
            for (final T e : this.elements) els.add(e);
            return els;
        }
    }

    /**
     * @effects
     *  if this is empty
     *    throw an IllegalStateException
     *  else
     *    return an arbitrary element of this
     */
    public T choose() throws IllegalStateException {
        if (this.size() == 0)
            throw new IllegalStateException("Set.choose: set is empty");
        return this.elements.lastElement();
    }

    /**
     * @effects
     *  if x is in this
     *    return the index where x appears
     *  else
     *    return -1
     */
    private int getIndex(final T x) {
        for (int i = 0; i < this.elements.size(); i++) {
            if (x.equals(this.elements.get(i)))
                return i;
        }

        return -1;
    }

    @Override
    public String toString() {
        if (this.size() == 0)
            return "Set:{ }";

        String s = "Set:{" + this.elements.elementAt(0).toString();
        for (int i = 1; i < this.size(); i++) {
            s = s + " , " + this.elements.elementAt(i).toString();
        }

        return s + "}";
    }

    /**
     * @effects
     *   if this satisfies abstract properties
     *     return true
     *   else
     *     return false
     */
    public boolean repOK() {
        if (this.elements == null)
            return false;

        for (int i = 0; i < this.elements.size(); i++) {
            final T x = this.elements.get(i);

            for (int j = i + 1; j < this.elements.size(); j++) {
                if (this.elements.get(j).equals(x))
                    return false;
            }
        }
        return true;
    }
}

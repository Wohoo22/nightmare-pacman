package utils;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

/**
 * @overview Defines a domain constraint of some attribute
 * @author dmle
 *
 */
@Retention(RetentionPolicy.RUNTIME)
public @interface DomainConstraint {  
  
  /***
   * Represents 0+, used to specify the min of real-type attributes 
   *  whose values are positive
   */
  double ZERO_PLUS = Double.MIN_VALUE/Double.MAX_VALUE;

  /***
   * Represents 0-, used to specify the max of real-type attributes 
   *  whose values are negative
   */
  double ZERO_MINUS = -Double.MIN_VALUE/Double.MAX_VALUE;
  
  String type() default "null";
  boolean mutable() default true;
  boolean optional() default true;
  int length() default  -1;
  double min() default Double.NaN;
  double max() default Double.NaN;
}

<?php
/**
 * The main template file
 * 
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * 
 * @package Antigravity
 * @since 1.0.0
 */

get_header(); ?>

<div id="primary" class="content-area">
    <main id="main" class="site-main">
        
        <div class="container">
            
            <?php
            if ( have_posts() ) :
                
                // Start the Loop
                while ( have_posts() ) :
                    the_post();
                    ?>
                    
                    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                        
                        <header class="entry-header">
                            <h1 class="entry-title">
                                <a href="<?php the_permalink(); ?>">
                                    <?php the_title(); ?>
                                </a>
                            </h1>
                            
                            <div class="entry-meta">
                                <span class="posted-on">
                                    <?php echo get_the_date(); ?>
                                </span>
                                <span class="byline">
                                    by <?php the_author(); ?>
                                </span>
                            </div>
                        </header><!-- .entry-header -->
                        
                        <?php if ( has_post_thumbnail() ) : ?>
                            <div class="post-thumbnail">
                                <?php the_post_thumbnail( 'large' ); ?>
                            </div>
                        <?php endif; ?>
                        
                        <div class="entry-content">
                            <?php
                            the_content( sprintf(
                                wp_kses(
                                    __( 'Continue reading %s <span class="meta-nav">&rarr;</span>', 'antigravity' ),
                                    array( 'span' => array( 'class' => array() ) )
                                ),
                                the_title( '<span class="screen-reader-text">"', '"</span>', false )
                            ) );
                            
                            wp_link_pages( array(
                                'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'antigravity' ),
                                'after'  => '</div>',
                            ) );
                            ?>
                        </div><!-- .entry-content -->
                        
                    </article><!-- #post-<?php the_ID(); ?> -->
                    
                    <?php
                endwhile;
                
                // Pagination
                the_posts_pagination( array(
                    'prev_text' => esc_html__( 'Previous', 'antigravity' ),
                    'next_text' => esc_html__( 'Next', 'antigravity' ),
                ) );
                
            else :
                ?>
                
                <section class="no-results not-found">
                    <header class="page-header">
                        <h1 class="page-title"><?php esc_html_e( 'Nothing Found', 'antigravity' ); ?></h1>
                    </header>
                    
                    <div class="page-content">
                        <p><?php esc_html_e( 'It seems we can&rsquo;t find what you&rsquo;re looking for. Perhaps searching can help.', 'antigravity' ); ?></p>
                        <?php get_search_form(); ?>
                    </div>
                </section>
                
                <?php
            endif;
            ?>
            
        </div><!-- .container -->
        
    </main><!-- #main -->
</div><!-- #primary -->

<?php get_footer(); ?>